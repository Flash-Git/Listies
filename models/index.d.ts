import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  verified: boolean;
  password: string;
  date: Date;
  accessCodes: string[];
}

export interface List extends Document {
  user: User["_id"];
  accessCode: string;
  name: string;
  date: Date;
  count: number;
}

export interface Item extends Document {
  user: User["_id"];
  list: List["_id"];
  name: string;
  checked: boolean;
  note: string;
  date: Date;
}
