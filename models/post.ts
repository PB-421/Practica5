import Comment from "./comments.ts";

//deberia de tener los mismos nombres que los que devuelve la api, y es un tipo
export type Post = {
  _id: string;
  title: string;
  content: string;
  author: string;
  cover: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export default Post;
