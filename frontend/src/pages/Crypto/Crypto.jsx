import { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { getCrypto } from "../../api/external";
import styles from "./Crypto.module.css";

function Crypto() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function cryptoApiCall() {
      try {
        const response = await getCrypto();

        if (isMounted) {
          setData(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error("Crypto API error:", error);
        if (isMounted) {
          setData([]);
        }
      }
    }

    cryptoApiCall();

    return () => {
      isMounted = false;
    };
  }, []);

  if (data.length === 0) {
    return <Loader text="cryptocurrencies" />;
  }

  const negativeStyle = {
    color: "#ea3943",
  };

  const positiveStyle = {
    color: "#16c784",
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th>#</th>
          <th>Coin</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h</th>
        </tr>
      </thead>

      <tbody>
        {data.map((coin) => (
          <tr id={coin.id} key={coin.id} className={styles.tableRow}>
            <td>{coin.market_cap_rank}</td>

            <td>
              <div className={styles.logo}>
                <img
                  src={coin.image}
                  alt={`${coin.name} logo`}
                  width={40}
                  height={40}
                />
                {coin.name}
              </div>
            </td>

            <td>
              <div className={styles.symbol}>{coin.symbol}</div>
            </td>

            <td>{coin.current_price}</td>

            <td
              style={
                coin.price_change_percentage_24h < 0
                  ? negativeStyle
                  : positiveStyle
              }
            >
              {coin.price_change_percentage_24h}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Crypto;