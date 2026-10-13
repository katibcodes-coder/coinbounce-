import axios from "axios";

const NEWS_API_ENDPOINT =
  "https://coinbounce.de.deplexo.com/news";

const CRYPTO_API_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

export const getNews = async () => {
  try {
    const response = await axios.get(NEWS_API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("News API error:", error.response?.data || error.message);
    return [];
  }
};

export const getCrypto = async () => {
  try {
    const response = await axios.get(CRYPTO_API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Crypto API error:", error);
    return [];
  }
};