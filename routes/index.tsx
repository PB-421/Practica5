import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";
import Post from "../models/post.ts";
import { useSignal } from "@preact/signals";
import MainView from "../islands/MainView.tsx";

async function getPost():Promise<Post[]> {
     const data = await fetch("https://back-p5-y0e1.onrender.com/api/posts/")
    if(data.status !== 200) throw new Error("Fallo en API Post")
    const response = await data.json()
    const posts:Post[] = response.data.posts
    return posts
}

type data = {
  post: Post[]
}

export const handler: Handlers = {
  async GET(_req, ctx: FreshContext<unknown,data>) {
    try {
      const post = await getPost()
      return ctx.render({ post: post });
    } catch (_) {
      return ctx.render({ post: [] });
    }
  },
};

export default function Home(props: PageProps) {
  const isGrid = useSignal<boolean>(false);
  const { post } = props.data;
  return (
    <div>
      <h1>Últimos posts</h1>

      {post.length === 0
        ? (
          <div className="center">
            <p>No hay posts</p>
          </div>
        )
        : (
          <MainView isGrid={isGrid} posts={post} />
        )}
    </div>
  );
}
