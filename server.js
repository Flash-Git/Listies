const express = require("express");
const path = require("path");
const socketIo = require("socket.io");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

const getSocket = () => sockets;

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/lists", require("./routes/api/lists"));
const router = require("./routes/api/items")(getSocket);
app.use("/api/items", router);

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = socketIo(server);

// const socket = io();

// let interval;

let sockets = [];

io.on("connection", socket => {
  console.log("New client connected");
  sockets.push(socket);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    sockets.filter(s => s != socket);
  });
});

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };
