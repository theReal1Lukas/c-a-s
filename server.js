const express = require("express");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const PORT = process.env.PORT || 5000;
const http = require("http").Server(app);
const jwt = require("jsonwebtoken");
const io = require("socket.io")(http);

dotenv.config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;
mongoose.connect(`${uri}`);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection to database is successfull");
});

const usersRoute = require("./routes/users");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");
const authRoute = require("./routes/auth");

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

///////////////////// SOCKET /////////////////////
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

// io.listen(PORT, () => console.log(`Socket is running on port ${PORT}`));

///////////////////// SOCKET /////////////////////

http.listen(PORT, () => console.log(`server is running on port ${PORT}`));
