/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function WalletData(walletInfo, total) {
  return {
    columns: [
      { Header: "NO", accessor: "NO", width: "20%", align: "center" },
      { Header: "WALLETADDRESS", accessor: "WALLETADDRESS", with: "50%", align: "center" },
      { Header: "AMOUNT", accessor: "AMOUNT", align: "center" },
      { Header: "PERCENT(%)", accessor: "PERCENT", align: "center" },
      { Header: "STATUS", accessor: "STATUS", align: "center" },
    ],
    rows: walletInfo
      .filter((item) => item.STATUS != true)
      .sort((p1, p2) => {
        if (p1.AMOUNT > p2.AMOUNT) return -1;
        if (p1.AMOUNT < p2.AMOUNT) return 1;
        return 0;
      })
      .map((item, index) => {
        return {
          ...item,
          AMOUNT: (item.AMOUNT / 10 ** total.decimal).toFixed(0),
          PERCENT: ((item.AMOUNT * 100) / total.total).toFixed(2),
          NO: index + 1,
          STATUS:
            item.STATUS === -1 ? (
              <CircularProgress />
            ) : item.STATUS === false ? (
              <CheckIcon style={{ color: "green", fontSize: 24 }} />
            ) : (
              <CloseIcon style={{ color: "red", fontSize: 24 }} />
            ),
        };
      }),
  };
}
