import express from "express";

import Server from "./server/server";

const app = express();

const PORT = process.env.PORT || 5000;

const server = new Server(app);

server.start(PORT);
