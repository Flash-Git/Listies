import Server from "./server/server";
import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;

const server = new Server(app);

server.start(PORT);
