import express, { Express, Request, Response } from "express";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";
import dotenv from "dotenv";

import connectDB from "../config/db";

import usersRoutes from "../routes/api/users";
import authRoutes from "../routes/api/auth";
import listsRoutes from "../routes/api/lists";
import itemsRoutes from "../routes/api/items";

if (process.env.NODE_ENV !== "production") dotenv.config();

class Server {
  private app: Express;
  private sockets: Socket[] = [];
  private io: SocketServer;

  constructor(app: Express) {
    this.app = app;

    //Connect Database
    connectDB();

    //Init Middleware
    this.app.use(express.json());

    // Define Routes
    this.app.use("/api/users", usersRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/lists", listsRoutes);
    this.app.use(
      "/api/items",
      itemsRoutes(() => this.sockets)
    );

    // Serve static assets in production
    if (process.env.NODE_ENV === "production") {
      this.app.use(express.static("build/client/"));
      this.app.get("*", (req: Request, res: Response): void =>
        res.sendFile(path.resolve(__dirname, "build", "client", "index.html"))
      );
    }
  }

  public start(port: number | string): void {
    const server = this.app.listen(port, () =>
      console.log(`Server started on port ${port}`)
    );

    this.io = require("socket.io")(server);

    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected");
      this.sockets.push(socket);
      socket.on("disconnect", reason => {
        console.log("Client disconnected: " + reason);
        this.sockets.filter(s => s !== socket);
      });
    });
  }
}

export default Server;
