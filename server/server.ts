import express, { Express, Request, Response } from "express";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";
import dotenv from "dotenv";

import connectDB from "../config/db";

import usersRoutes from "../routes/api/users";
import authRoutes from "../routes/api/auth";
import verificationRoutes from "../routes/api/verification";
import listsRoutes from "../routes/api/lists";
import itemsRoutes from "../routes/api/items";

import { User } from "models";

if (process.env.NODE_ENV !== "production") dotenv.config();

interface SocketObj {
  socket: Socket;
  user: User;
  listId?: string;
}

type SocketObjs = SocketObj[];

class Server {
  private app: Express;
  private sockets: SocketObjs = [];
  private io: SocketServer;

  constructor(app: Express) {
    this.app = app;

    // Connect Database
    connectDB();

    // Init Middleware
    this.app.use(express.json());

    // Define Routes
    this.app.use("/api/users", usersRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/verification", verificationRoutes);
    this.app.use(
      "/api/lists",
      listsRoutes((userId) => this.getSockets(userId, "userId"))
    );
    this.app.use(
      "/api/items",
      itemsRoutes((listId: string) =>
        this.sockets.filter((obj) => obj.listId === listId).map((obj) => obj.socket)
      )
    );

    // Serve static assets in production
    if (process.env.NODE_ENV === "production") {
      this.app.use(express.static("build/client/"));
      this.app.get("/*", (_req: Request, res: Response): void =>
        res.sendFile(path.resolve(__dirname + "/..", "client", "index.html"))
      );
    }
  }

  private getSockets(param: string, type: "userId" | "listId") {
    const filter = () => {
      switch (type) {
        case "userId":
          return this.sockets.filter((obj) => obj.user._id.toString() === param);
        case "listId":
          return this.sockets.filter((obj) => obj.listId === param);
      }
    };

    return filter().map((obj) => obj.socket);
  }

  public start(port: number | string): void {
    const server = this.app.listen(port, () => console.log(`Server started on port ${port}`));

    this.io = require("socket.io")(server);

    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected");

      socket.on("identify", (user) => {
        console.log("identifying user", user);
        this.sockets.push({ socket, user });
      });

      socket.on("updateList", (listId) => {
        console.log("updating list", listId);
        const sock = this.sockets.find((obj) => obj.socket === socket);
        if (sock) sock.listId = listId;
      });

      socket.on("disconnect", (reason) => {
        console.log("Client disconnected: " + reason);
        this.sockets = this.sockets.filter((obj) => obj.socket !== socket);
      });
    });
  }
}

export default Server;
