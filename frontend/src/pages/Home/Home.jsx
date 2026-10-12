
import { useState, useEffect } from "react";
import { getNews } from "../../api/external";
import styles from "./Home.module.css";
import Loader from "../../components/Loader/Loader";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function newsApiCall() {
      try {
        const response = await getNews();

        if (isMounted) {
          setArticles(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error("News load failed:", error);
        if (isMounted) {
          setArticles([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    newsApiCall();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <Loader text="homepage" />;
  }

  if (articles.length === 0) {
    return (
      <div className={styles.header}>
        News abhi load nahi ho saki. Thori dair baad page refresh karo.
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>Latest Articles</div>

      <div className={styles.grid}>
        {articles.map((article, index) => (
          <div
            className={styles.card}
            key={article.url || `${article.title}-${index}`}
            onClick={() => handleCardClick(article.url)}
            role="link"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCardClick(article.url);
              }
            }}
          >
            <img
              src={article.image || article.urlToImage || ""}
              alt={article.title || "News"}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <h3>{article.title || "Untitled article"}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
