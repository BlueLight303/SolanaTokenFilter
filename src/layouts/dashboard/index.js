// @mui material components
import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDSnackbar from "../../components/MDSnackbar";
import Tables from "../../layouts/tables";

// Material Dashboard 2 React components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ComplexStatisticsCardOne from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard/complex";

// Data
import getWallet from "../../fetchData/walletlist";
import getTokenInfo from "../../fetchData/TokenInfo";
import CheckFilter from "../../fetchData/checkFilter";

// Constants
import * as Status from "../../config/constants";

function Dashboard() {
  const totalStorage = localStorage.getItem("total");
  const prePctStorage = localStorage.getItem("prePct");
  const localSetting = localStorage.getItem("setting");
  const localStorageSetting = localSetting
    ? JSON.parse(localSetting)
    : { premined: [0, 100], amm: [0, 100], locked: [0, 100], mint: "", burned: "", sol: 50 };

  const [newTokenList, setNewTokenList] = useState([]);
  const [tokenHolderList, setTokenHolderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prePct, setPrePct] = useState(0);
  const [notificationText, setNotificationText] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [action, setAction] = useState(true);
  const [prevStatus, setPrevStatus] = useState(Status.NONE);
  const [currentStatus, setCurrentStatus] = useState(Status.NONE);
  const [filter, setFilter] = useState(localStorageSetting);
  const [startCheck, setStartCheck] = useState(false);
  const [newTokenAddrss, setNewTokenAddress] = useState("");
  const [filteringTokenAddress, setFilteringTokenAddress] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    symbol: "",
    total: 0,
    decimal: 0,
    liquidity: { lpLocked: 0, tokenSupply: 100 },
    amm: 0,
    mintAuthority: null,
    freezeAuthority: null,
    sol: 0,
  });

  const initInterface = () => {
    setFilteringTokenAddress("");
    setLoading(false);
    setTokenHolderList([]);
    setPrePct(0);
    setTokenInfo({
      symbol: "",
      total: 0,
      decimal: 0,
      liquidity: { lpLocked: 0, tokenSupply: 100 },
      amm: 0,
      mintAuthority: null,
      freezeAuthority: null,
      sol: 0,
    });
  };

  const initDashboard = () => {
    initInterface();
    setPrevStatus(Status.NONE);
    setCurrentStatus(Status.NONE);
  };

  const fetchNewToken = async () => {
    const URL = "https://solanacheck-07bdccc69c5e.herokuapp.com/getNewToken";
    const token = await fetch(URL).then((res) => res.json());
    setNewTokenAddress(token.address);
    console.error(token.address);
  };

  const changeWallets = (nonBuyOwners, pct) => {
    setPrePct((before) => pct);
    setTokenHolderList((beforeState) => [...nonBuyOwners]);
    setLoading(false);
  };

  const closeNotification = () => {
    setNotificationStatus(false);
  };

  const extract = (tokenAddress) => {
    if (tokenAddress.length == 44) {
      setNewTokenAddress(tokenAddress);
      if (!autoMode) {
        setPrevStatus(currentStatus);
        setCurrentStatus(Status.STARTED);
      }
      setStartCheck(false);
      setLoading(true);
      getTokenInfo({
        tokenAddress: tokenAddress,
        setNotificationText: setNotificationText,
        setNotificationStatus: setNotificationStatus,
        setStatus: setCurrentStatus,
        setTokenInfo: (tokenInfo) => setTokenInfo(tokenInfo),
      });
    }
  };

  useEffect(() => {
    if (newTokenAddrss != "") {
      // Check if the new token already exists in the list
      const exists = newTokenList.some((address, index) => address === newTokenAddrss);
      if (!exists) setNewTokenList((prevList) => [...prevList, newTokenAddrss]);
      setNewTokenAddress("");
      if (currentStatus == Status.GET_NEW_TOKEN) {
        // If it is here for getting next token address, change the status from GET_NEW_TOKEN to STARTING
        setCurrentStatus(Status.STARTING);
      }
    }
  }, [newTokenAddrss]);

  useEffect(() => {
    if (!action) {
      const interval = setInterval(() => fetchNewToken(), 10000);
      return () => clearInterval(interval);
    }
  }, [action]);

  useEffect(() => {
    if (startCheck) {
      setCurrentStatus(CheckFilter(tokenInfo, prePct, filter));
    }
  }, [startCheck]);

  useEffect(() => {
    if (currentStatus == Status.FINISHED) {
      if (autoMode) {
        setNotificationText("Search for pre-mined tokens is complete!");
        setNotificationStatus(true);
        setAutoMode(false);
        setAction(true);
      }
      setPrevStatus(currentStatus);
      setCurrentStatus(Status.NONE);
    } else if (currentStatus == Status.PAUSING) {
      initDashboard();
      setPrevStatus(currentStatus);
      setCurrentStatus(Status.PAUSED);
    } else if (currentStatus == Status.NEXT_STARTING) {
      console.error("Current status: NEXT_STARTING");
      setPrevStatus(currentStatus);
      setCurrentStatus(Status.STARTING);
    } else if (currentStatus == Status.STOPPING) {
      setPrevStatus(currentStatus);
      setCurrentStatus(Status.STOPPED);
    } else if (currentStatus == Status.GET_TOTAL_INFO_SUCCESS) {
      setCurrentStatus(Status.STARTED);
      getWallet({
        tokenAddress: filteringTokenAddress,
        autoMode: autoMode,
        currentStatus: currentStatus,
        tokenInfo: tokenInfo,
        func: changeWallets,
        setStartCheck: setStartCheck,
        setNotificationText: setNotificationText,
        setNotificationStatus: setNotificationStatus,
        setCurrentStatus: setCurrentStatus,
      });
    }
  }, [currentStatus]);

  useEffect(() => {
    if (prevStatus == Status.STOPPING && currentStatus == Status.STOPPED && autoMode) {
      setNotificationText("Searching the next token! Please wait...");
      setNotificationStatus(true);
      setCurrentStatus(Status.NEXT_STARTING);
      initInterface();
    } else if (prevStatus == Status.STOPPING && currentStatus == Status.STOPPED && !autoMode) {
      setNotificationText("This token isn't matched the filter!");
      setNotificationStatus(true);
      setCurrentStatus(Status.FINISHED);
    }
  }, [prevStatus]);

  useEffect(() => {
    if (action) {
      setTokenHolderList(tokenHolderList.filter((item) => item.STATUS != -1));
    }
  }, [action]);

  useEffect(() => {
    if (newTokenList.length > 0) {
      const token = newTokenList[newTokenList.length - 1];
      const filteredTokens = newTokenList.filter((item, index) => index != 0);
      if (autoMode && currentStatus == Status.STARTING) {
        if (newTokenAddrss == "" && token != filteringTokenAddress) {
          initDashboard();
          setCurrentStatus(Status.STARTED);
          setNewTokenAddress(token);
          setFilteringTokenAddress(token);
          extract(token);
          setNewTokenList(filteredTokens);
        }
      }
    } else if (currentStatus == Status.STARTING && prevStatus != Status.NONE && autoMode) {
      fetchNewToken(); // get new token address in case of that there is no next token address to filter
      setNotificationText("Being filtered New Token. Please wait for some minutes!");
      setNotificationStatus(true);
      setCurrentStatus(Status.GET_NEW_TOKEN);
    }
  }, [autoMode, newTokenList, currentStatus]);

  const liquidityLockPercent = tokenInfo.liquidity.lpLockedPct;
  return (
    <DashboardLayout>
      <DashboardNavbar
        callback={extract}
        setFilter={setFilter}
        action={action}
        setAction={setAction}
        status={currentStatus}
        setStatus={setCurrentStatus}
        setAutoMode={setAutoMode}
        setAutoNewTokens={setNewTokenList}
        symbol={tokenInfo.symbol}
        contractAdd={filteringTokenAddress}
        setContractAdd={setFilteringTokenAddress}
      />
      <MDBox py={5}>
        <Grid container spacing={6} pr={12} pl={12} pt={10}>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox>
              <ComplexStatisticsCard
                color="error"
                icon="paypal"
                title="TOTAL"
                count="34k"
                percentage={{
                  color: "success",
                  amount:
                    tokenInfo != {} ? (tokenInfo.total / 10 ** tokenInfo.decimal).toFixed() : 0,
                  amount1: tokenInfo.sol,
                  label: "Token supply",
                  label1: "POOLED SOL",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="percent"
                title="Pre-mined and Amm Percentage"
                count="34k"
                percentage={{
                  color: "success",
                  amount: prePct,
                  amount1: tokenInfo != {} ? tokenInfo.amm : 0,
                  label: "Premined PCT(%)",
                  label1: "AMM PCT(%)",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox>
              <ComplexStatisticsCardOne
                color="primary"
                icon="weekend"
                title="Mint Authority Revoked"
                count={281}
                percentage={{
                  color: "success",
                  amount: tokenInfo.mintAuthority === null ? "No" : "Yes",
                  label: "Revoked",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox>
              <ComplexStatisticsCard
                color="secondary"
                icon="leaderboard"
                title="Liquidity"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: liquidityLockPercent ? liquidityLockPercent.toFixed(2) : 0,
                  amount1: tokenInfo.freezeAuthority === null ? "No" : "Yes",
                  label: "LockedPct(%)",
                  label1: "Burned",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container pr={12} pl={12}>
          <Grid item xs={12} md={12} lg={12}>
            <MDBox mb={1}>
              <MDSnackbar
                color="success"
                icon="check"
                title="Check Result"
                content={
                  notificationText != ""
                    ? notificationText
                    : "Search for pre-mined tokens is complete!"
                }
                dateTime="now"
                open={notificationStatus}
                onClose={closeNotification}
                close={closeNotification}
                bgWhite
              />
              <Tables tokenHolderList={tokenHolderList} total={tokenInfo} loading={loading} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
