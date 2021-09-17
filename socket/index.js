const io = require("socket.io")(9000, {
  cors: {
    origin: "https://stormy-tundra-12181.herokuapp.com/",
  },
});
const jwt = require("jsonwebtoken");

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connected
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    const cryptMessage = jwt.sign(
      {
        data: text,
      },
      "MyOtherBiggestSecret",
      { expiresIn: "1h" }
    );

    io.to(user.socketId).emit("getMessage", {
      senderId,
      text: cryptMessage,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
