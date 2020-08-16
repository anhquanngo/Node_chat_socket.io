const express = require("express");
const socketIO = require("socket.io");

const app = express();

app.use("/access", express.static(__dirname + "/public/access"));

app.get("/chat", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

const port = 3000;

const server = app.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});

const io = socketIO(server);

const rooms = [
  {
    id: "room-1",
    name: "Room 1",
  },
  {
    id: "room-2",
    name: "Room 2",
  },
  {
    id: "room-3",
    name: "Room 3",
  },
];

io.on("connection", function (socket) {
  socket.on("GET-ROOMS", function () {
    socket.emit("RETURN-GET-ROOMS", { rooms });
  });

  socket.on("CONNECT-ROOM-CHAT", function (data) {
    socket.join(data.id);
    socket.emit("CONNECT-ROOM-CHAT-SUCCESS", { id: data.id, name: data.name });
  });

  socket.on("NEW-MESSAGE", function (data) {
    socket.to(data.currentRoom).emit("NEW-MESSAGE", { ...data, id: socket.id });
  });
  console.log("Client connected...");
});
