
const axios = require("axios");
const { GNEWS_API_KEY } = require("../config");

let cachedArticles = null;
let cacheExpiresAt = 0;
let pendingRequest = null;

exports.getNews = async (req, res) => {
  try {
    // Pehle cache check karo
    if (cachedArticles && Date.now() < cacheExpiresAt) {
      return res.json(cachedArticles);
    }

    if (!GNEWS_API_KEY) {
      return res.status(500).json({
        message: "GNews API key backend .env mein set nahi hai.",
      });
    }

    // Ek waqt mein sirf ek GNews request
    if (!pendingRequest) {
      pendingRequest = axios
        .get("https://gnews.io/api/v4/top-headlines", {
          params: {
            category: "business",
            lang: "en",
            country: "us",
            max: 10,
            apikey: GNEWS_API_KEY,
          },
          timeout: 15000,
        })
        .then((response) => {
          cachedArticles = response.data.articles || [];
          // Successful news ko 30 minutes cache karo
          cacheExpiresAt = Date.now() + 30 * 60 * 1000;
          return cachedArticles;
        })
        .finally(() => {
          pendingRequest = null;
        });
    }

    const articles = await pendingRequest;
    return res.json(articles);
  } catch (error) {
    console.error(
      "GNews error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      message: "News abhi load nahi ho saki. Thori dair baad try karo.",
    });
  }
};
