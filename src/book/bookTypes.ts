import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
  coverImage: string;
  file: string;
}
