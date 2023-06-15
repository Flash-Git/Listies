import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  verified: boolean;
  password: string;
  date: number;
  accessIds: string[];
}

export interface List extends Document {
  owner: User["_id"];
  accessId: string;
  password?: string;
  name: string;
  private: boolean;
  users: User["_id"][];
  date: number;
}

export interface Item extends Document {
  user: User["_id"];
  list: List["_id"];
  name: string;
  checked: boolean;
  importance: number;
  marked?: boolean;
  note: string;
  date: number;
}
