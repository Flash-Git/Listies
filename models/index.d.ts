import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  verified: boolean;
  password: string;
  date: Date;
  accessIds: string[];
}

export interface List extends Document {
  user: User["_id"];
  accessId: string;
  password?: string;
  name: string;
  date: Date;
}

export interface Item extends Document {
  user: User["_id"];
  list: List["_id"];
  name: string;
  checked: boolean;
  importance: number;
  note: string;
  date: Date;
}
