import { useNavigate, useParams } from "react-router";
import { getArticle } from "../api/client.js";
import { useEffect, useState } from "react";
import { MoveLeft } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticle(id);
      setArticle(data);
    };
    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bounce-in p-4 flex flex-col justify-start items-center bg-black text-white min-h-screen">
      <div className="m-30 max-w-150">
        <MoveLeft
          className="my-4 w-8 h-8 cursor-pointer"
          onClick={() => navigation("/")}
        />
        <h1 className=" playfair font-bold text-4xl">{article.title}</h1>
        <ul className="my-4 flex gap-4 flex-wrap">
          {article.tags.map((tag, index) => {
            return (
              <li key={index} className="text-nowrap text-sm text-neutral-400">
                <span className=" italic text-yellow-500 font-extralight">
                  #{tag}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="leading-loose mb-30 text-neutral-300 font-extralight inter max-w-150">
        {article.content.split(".").map((sentence, sentenceIndex) => {
          if (!sentence.trim()) return null;
          const words = sentence.split(" ").filter((w) => w);
          return (
            <span key={sentenceIndex}>
              {words.map((word, wordIndex) => {
                const isLast = wordIndex === words.length - 1;
                const element =
                  word[0] === word[0].toUpperCase() ? (
                    <span className=" hover:underline font-normal text-yellow-500">
                      {word}
                    </span>
                  ) : (
                    <span>{word}</span>
                  );
                return (
                  <span key={wordIndex}>
                    {element}
                    {isLast &&
                      sentenceIndex < article.content.split(".").length - 1 &&
                      "."}
                    {!isLast && " "}
                  </span>
                );
              })}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default ArticleDetail;
