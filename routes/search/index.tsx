import { Handlers,FreshContext, PageProps } from "$fresh/server.ts";
import PostComponent from "../../components/Post.tsx";
import Post from "../../models/post.ts";


async function getPostByName(name:string):Promise<Post[]> {
    const data = await fetch("https://back-p5-y0e1.onrender.com/api/posts/")
    if(data.status !== 200) throw new Error("Fallo en API Post")
    const response = await data.json()
    const posts:Post[] = response.data.posts
    const matchingPost = posts.filter((post) => post.title.toLowerCase().includes(name.toLowerCase()))
    return matchingPost
}

async function getPostByAuthor(author:string):Promise<Post[]> {
    const data = await fetch("https://back-p5-y0e1.onrender.com/api/posts/")
    if(data.status !== 200) throw new Error("Fallo en API Post")
    const response = await data.json()
    const posts:Post[] = response.data.posts
    const matchingPost = posts.filter((post) => post.author.toLowerCase().includes(author.toLowerCase()))
    return matchingPost
}

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext<unknown, SearchProps>) {
    try {
      const { url } = req;
      const searchParams = new URL(url).searchParams;
      const query = searchParams.get("search");
      console.log(query);
      if (!query || query.trim() === "") {
        return ctx.render({ posts: [], query: undefined });
      }

      const PostNombre = await getPostByName(query);
      const PostAutor = await getPostByAuthor(query);

      // Eliminar duplicados por título y autor
      const allPosts = [...PostNombre, ...PostAutor];
      const uniquePostsMap = new Map<string, Post>();
      allPosts.forEach((post) => {
        const key = `${post.title.toLowerCase()}|${post.author.toLowerCase()}`;
        uniquePostsMap.set(key, post);
      });

      const final = Array.from(uniquePostsMap.values());

      return ctx.render({ posts: final, query: query });
    } catch (_) {
      return ctx.render({ posts: [] });
    }
  },
};



type SearchProps = {
    posts: Post[];
    query?: string;
}
//Aqui son Pageprops lo que se pasa
export default function Search(props: PageProps) {
  const { posts, query } = props.data;
  const hasResults = posts.length > 0;
  console.log("hasResults:", hasResults);
  const searchTerm = query || "";

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Buscar publicaciones</h1>
        <form action="/search" method="get" className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              name="search"
              placeholder="Buscar por título o autor..."
              defaultValue={searchTerm}
              className="search-input"
              aria-label="Buscar publicaciones"
            />
            <button type="submit" className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Buscar</span>
            </button>
          </div>
        </form>
      </div>

      <div className="search-results">
        {searchTerm && (
          <div className="search-info">
            <h2>
              {hasResults
                ? `Mostrando ${posts.length} resultado${
                    posts.length !== 1 ? "s" : ""
                  } para "${searchTerm}"`
                : `No se encontraron resultados para "${searchTerm}"`}
            </h2>
          </div>
        )}

        {hasResults ? (
          <div className="posts-list">
            {posts.map((post: Post) => (
              <PostComponent key={post._id} post={post} isGrid={false} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="no-results">
            <p>Intenta con otros términos de búsqueda o revisa la ortografía.</p>
          </div>
        ) : (
          <div className="search-tips">
            <h3>Sugerencias de búsqueda:</h3>
            <ul>
              <li>Usa palabras clave específicas</li>
              <li>Prueba con diferentes términos</li>
              <li>Revisa la ortografía</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
