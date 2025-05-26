import { useState } from "preact/hooks";
import { JSX } from "preact";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isLiked?: boolean;
}

export default function LikeButton(
  { postId, initialLikes, isLiked = false }: LikeButtonProps,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`https://back-p5-y0e1.onrender.com/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al hacer la petición");
      }

      setLiked(!liked);
      setLikes((prev) => liked ? prev - 1 : prev + 1);

    } catch (err) {
      console.error("Error al dar like:", err);
      setError("No se pudo dar like al post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-button-container">
      <button
        type="button"
        onClick={handleLike}
        disabled={isLoading}
        className={`like-button ${liked ? "liked" : ""} ${
          isLoading ? "loading" : ""
        }`}
        aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
      >
        <span className="like-icon">
          {isLoading ? "⏳" : liked ? "❤️" : "🤍"}
        </span>
        <span className="like-count">{likes}</span>
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
