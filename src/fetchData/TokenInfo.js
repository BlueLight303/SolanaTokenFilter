import * as Status from "../config/constants";

let tokenList = [];

const getTokenInfo = async ({
  tokenAddress,
  setNotificationText,
  setNotificationStatus,
  setStatus,
  setTokenInfo,
}) => {
  const exists = tokenList.some((address, index) => address === tokenAddress);
  if (!exists) {
    tokenList.push(tokenAddress);
  } else {
    setStatus(Status.NEXT_STARTING);
    return;
  }

  console.error(tokenList);

  const urlrug = `https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`;
  const urldex = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

  try {
    const response = await fetch(urlrug);
    const data = await response.json();
    if (data === null || data.topHolders === null) {
      setNotificationStatus(true);
      setNotificationText("The current token is invalid. Searching next token!");
      setStatus(Status.NEXT_STARTING);
      return;
    }

    const responseDex = await fetch(urldex);
    const dataDex = await responseDex.json();
    const AmmHolder = await data.topHolders.filter(
      (item) => item.owner == "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"
    );

    const pooledSol = dataDex.pairs ? dataDex.pairs[0].liquidity.quote.toFixed() : 0;
    setTokenInfo({
      symbol: data.tokenMeta.symbol,
      total: data.token.supply,
      decimal: data.token.decimals,
      mintAuthority: data.token.mintAuthority,
      freezeAuthority: data.token.freezeAuthority,
      liquidity: data.markets ? data.markets[0].lp : 0,
      amm:
        AmmHolder[0] && AmmHolder[0].amount
          ? ((AmmHolder[0].amount * 100) / data.token.supply).toFixed(2)
          : 0,
      sol: pooledSol,
    });

    const setting = localStorage.getItem("setting");
    const { sol } = JSON.parse(setting);
    console.error(sol, pooledSol);
    if (pooledSol < sol[0] || pooledSol > sol[1]) {
      setNotificationStatus(true);
      setNotificationText("The current token is invalid. Searching next token!");
      setStatus(Status.NEXT_STARTING);
    } else {
      setStatus(Status.GET_TOTAL_INFO_SUCCESS);
    }
  } catch (e) {
    setNotificationStatus(true);
    setNotificationText("The current token is invalid. Searching next token!");
    setStatus(Status.NEXT_STARTING);
  }
};
export default getTokenInfo;