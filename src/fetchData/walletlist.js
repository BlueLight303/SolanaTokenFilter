import _ from "lodash";
import * as Status from "../config/constants";
import * as Config from "../config/config";

export const getLocalStorageData = () => {
  const walletInfo = localStorage.getItem("walletInfo");
  if (walletInfo === null) return {};
  return JSON.parse(walletInfo);
};

const getWallet = async ({
  tokenAddress,
  autoMode,
  currentStatus,
  tokenInfo,
  func,
  setStartCheck,
  setNotificationText,
  setNotificationStatus,
  setCurrentStatus,
}) => {
  const url = `https://mainnet.helius-rpc.com/?api-key=${Config.HELIUS_API_KEY}`;

  const findHolders = async () => {
    let page = 1;
    let walletList = [];
    const total = tokenInfo.total;

    while (true) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "getTokenAccounts",
          id: "helius-test",
          params: {
            page: page,
            limit: 1000,
            displayOptions: {},
            mint: tokenAddress,
          },
        }),
      });

      const data = await response.json();

      if (!data.result || data.result.token_accounts.length === 0) {
        break;
      }

      data.result.token_accounts.forEach((account) => {
        if ((account.amount * 100) / total > 0.1) {
          walletList.push({ WALLETADDRESS: account.owner, AMOUNT: account.amount, STATUS: -1 });
        }
      });
      page++;
    }

    const maxLength = walletList.length;
    console.error("Max length = ", maxLength);

    const getWalletInfo = async (address, index) => {
      console.error(`getWalletInfo function ${index} : started`);

      let flag = false;
      let url2 = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${Config.HELIUS_API_KEY}`;
      let lastSignature = null;
      const walletStorageInfo = getLocalStorageData();

      try {
        let url1 = url2;
        if (lastSignature) url1 = url2 + `&before=${lastSignature}`;

        const response = await fetch(url1);
        let owner = await response.json();
        if (owner && owner.length > 0) {
          const fiteredOwner = owner.filter((x) => x.type == "SWAP" || x.type == "UNKNOWN");
          for (let i = 0; i < fiteredOwner.length; i++) {
            if (fiteredOwner[i].tokenTransfers.length > 0) {
              for (let j = 0; j < fiteredOwner[i].tokenTransfers.length; j++) {
                if (
                  fiteredOwner[i].tokenTransfers[j].mint == tokenAddress &&
                  fiteredOwner[i].tokenTransfers[j].toUserAccount == address
                ) {
                  flag = true;
                  break;
                }
              }
            }
            if (flag == true) break;
          }

          if (flag != true) {
            lastSignature = owner[owner.length - 1].signature;
            walletList[index].lastSignature = lastSignature;
            walletStorageInfo[tokenAddress] = walletList;
            localStorage.setItem("walletInfo", JSON.stringify(walletStorageInfo));
          }
        } else {
          console.log("No more transactions available.", address);
        }
      } catch (e) {
        console.log(e);
      }

      if (walletList[index]) walletList[index].STATUS = flag;
      walletList[index].flag = flag;

      walletStorageInfo[tokenAddress] = _.filter(walletList, { STATUS: false });
      localStorage.setItem("walletInfo", JSON.stringify(walletStorageInfo));
      let filterOwner = walletList.filter((item) => item.STATUS == false);
      let preAmount = 0;
      for (let k = 0; k < filterOwner.length; k++) {
        preAmount += filterOwner[k].AMOUNT;
      }
      let prePct = ((preAmount * 100) / total).toFixed(2);
      localStorage.setItem("prePct", JSON.stringify(prePct));
      func(walletList, prePct);

      if (walletList.filter((item) => item.STATUS == -1).length == 0) {
        if (autoMode) {
          // start filtering in case of auto mode
          setStartCheck(true);
        } else {
          // finish the filtering
          setNotificationText("Search for pre-mined tokens is complete!");
          setNotificationStatus(true);
          setCurrentStatus(Status.FINISHED);
        }
      }

      return prePct;
    };

    const setting = localStorage.getItem("setting");
    const { premined } = JSON.parse(setting);
    for (let i = 0; i < maxLength; i++) {
      const prePct = await getWalletInfo(walletList[i].WALLETADDRESS, i);
      // console.error("Pre PCT = " + prePct);
      if (prePct > premined[1]) {
        setCurrentStatus(Status.STOPPING);
        break;
      }
    }
  };

  return findHolders();
};

export default getWallet;
