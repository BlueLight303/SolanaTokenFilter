import * as Status from "../config/constants";
import * as Config from "../config/config";
import * as Message from "../config/message";

const filteredTokenList = localStorage.getItem(Config.STORAGE_VAR_FILTEREDTOKENLIST);
let tokenList =
  filteredTokenList && filteredTokenList.length > 0 ? JSON.parse(filteredTokenList) : [];

const getTokenInfo = async ({
  tokenAddress,
  setNotificationText,
  setNotificationStatus,
  setStatus,
  setTokenInfo,
}) => {
  console.error("GetTokenInfo function called!");

  const exists = tokenList.some((address, index) => address === tokenAddress);
  if (!exists) {
    tokenList.push(tokenAddress);
    localStorage.setItem(Config.STORAGE_VAR_FILTEREDTOKENLIST, JSON.stringify(tokenList));
    console.error(tokenList);
  } else {
    console.error("Aleady checked token!");
    setStatus(Status.STARTING_NEXT);
    return;
  }

  console.error("Filtering Token Address: " + tokenAddress);

  const urlrug = `https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`;
  const urldex = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

  try {
    const response = await fetch(urlrug);
    const data = await response.json();
    if (data === null || data.topHolders === null) {
      console.error("It hasn't been existed about that token: " + tokenAddress);
      setNotificationStatus(true);
      setNotificationText(Message.TOKEN_INVALID);
      setStatus(Status.STARTING_NEXT);
      return;
    }

    const responseDex = await fetch(urldex);
    const dataDex = await responseDex.json();
    const AmmHolder = await data.topHolders.filter(
      (item) => item.owner == Config.RAYDIUM_AUTHORITY_ADDRESS
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

    const setting = localStorage.getItem(Config.STORAGE_VAR_SETTING);
    const { sol } = JSON.parse(setting);
    if (pooledSol < sol[0] || pooledSol > sol[1]) {
      setNotificationStatus(true);
      setNotificationText(Message.TOKEN_INVALID);
      setStatus(Status.STOPPING);
    } else {
      setStatus(Status.GOT_TOKENINFO);
    }
  } catch (e) {
    setNotificationStatus(true);
    setNotificationText(Message.TOKEN_INVALID);
    setStatus(Status.STOPPING);
  }
};
export default getTokenInfo;
