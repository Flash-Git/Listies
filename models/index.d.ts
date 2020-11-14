import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
  accessCodes: string[];
}

export interface IList extends Document {
  user: IUser["_id"];
  accessCode: string;
  name: string;
  date: Date;
  count: number;
}

export interface IItem extends Document {
  user: IUser["_id"];
  list: IList["_id"];
  name: string;
  checked: boolean;
  note: string;
  date: Date;
}
