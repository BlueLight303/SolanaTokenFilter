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

import { useState, useEffect } from "react";
import useSound from "use-sound";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Material Dashboard 2 React example components
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import { navbar, navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar } from "context";

import MDTypography from "components/MDTypography";

import Grid from "@mui/material/Grid";

import MDButton from "components/MDButton";
import SettingIcon from "@mui/icons-material/Settings";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";

import { Badge } from "@mui/material";

import * as Status from "../../../config/constants";

function DashboardNavbar({
  absolute,
  light,
  callback,
  setFilter,
  action,
  setAction,
  status,
  setStatus,
  setAutoMode,
  setAutoNewTokens,
  symbol,
  contractAdd,
  setContractAdd,
}) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { transparentNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [settingStatus, setSettingStatus] = useState(false);
  const [audio] = useState(new Audio("success.wav"));
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const makePercentText = (value) => {
    return `${value}%`;
  };

  const makeSolText = (value) => {
    return `${value}sol`;
  };

  useEffect(() => {
    if (status == Status.FINISHED) {
      audio.play();
    }
  }, [status]);

  const minDistance = 1;
  const localSetting = localStorage.getItem("setting");
  const localStorageSetting = localSetting
    ? JSON.parse(localSetting)
    : {
        premined: [0, 100],
        amm: [0, 100],
        locked: [0, 100],
        sol: [0, 1000],
        mint: "",
        burned: "",
      };

  useEffect(() => {
    if (!localSetting) {
      localStorage.setItem(
        "setting",
        JSON.stringify({
          premined: [0, 100],
          amm: [0, 100],
          locked: [0, 100],
          sol: [0, 1000],
          mint: "",
          burned: "",
        })
      );
    }
  }, []);
  const [premined, setPremined] = useState(localStorageSetting.premined);
  const [amm, setAmm] = useState(localStorageSetting.amm);
  const [locked, setLocked] = useState(localStorageSetting.locked);
  const [mint, setMint] = useState(localStorageSetting.mint);
  const [burned, setBurned] = useState(localStorageSetting.burned);
  const [sol, setSol] = useState(localStorageSetting.sol);
  const [alertStatus, setAlertStatus] = useState(false);
  const closeAlert = () => {
    setAlertStatus(false);
  };

  const onStart = () => {
    setAutoNewTokens([]);
    setContractAdd("");
    setAutoMode(true);
    setStatus(Status.STARTING);
    setAction(false);
  };

  const onPause = () => {
    setAutoMode(false);
    setStatus(Status.PAUSING);
    window.location.reload();
  };

  const handleChangePremined = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setPremined([Math.min(newValue[0], premined[1] - minDistance), premined[1]]);
    } else {
      setPremined([premined[0], Math.max(newValue[1], premined[0] + minDistance)]);
    }
  };

  const handleChangeAmm = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setAmm([Math.min(newValue[0], amm[1] - minDistance), amm[1]]);
    } else {
      setAmm([amm[0], Math.max(newValue[1], amm[0] + minDistance)]);
    }
  };

  const handleChangeLocked = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setLocked([Math.min(newValue[0], locked[1] - minDistance), locked[1]]);
    } else {
      setLocked([locked[0], Math.max(newValue[1], locked[0] + minDistance)]);
    }
  };

  const handleChangePooledSOL = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setSol([Math.min(newValue[0], sol[1] - minDistance), sol[1]]);
    } else {
      setSol([sol[0], Math.max(newValue[1], sol[0] + minDistance)]);
    }
  };

  const Change = (e) => {
    setContractAdd(e.target.value);
  };

  const onEnter = (e) => {
    if (e && e.keyCode == 13) {
      callback(contractAdd);
    }
  };
  const onOk = (e) => {
    setAutoMode(false);
    callback(contractAdd);
  };

  const onSave = () => {
    localStorage.setItem(
      "setting",
      JSON.stringify({
        premined: premined,
        amm: amm,
        locked: locked,
        mint: mint,
        burned: burned,
        sol: sol,
      })
    );

    setFilter({
      premined: premined,
      amm: amm,
      locked: locked,
      mint: mint,
      burned: burned,
      sol: sol,
    });

    setSettingStatus(false);
    setAlertStatus(true);
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem title={`Check new messages`} />
    </Menu>
  );

  const onSetting = () => {
    setSettingStatus(true);
  };

  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 8,
    p: 4,
  };

  const [openMint, setOpenMint] = useState(false);
  const [openBurned, setOpenBurned] = useState(false);

  const handleChangeMint = (event) => {
    setMint(event.target.value);
  };
  const handleChangeBurned = (event) => {
    setBurned(event.target.value);
  };

  const handleCloseMint = () => {
    setOpenMint(false);
  };
  const handleCloseBurned = () => {
    setOpenBurned(false);
  };

  const handleOpenMint = () => {
    setOpenMint(true);
  };
  const handleOpenBurned = () => {
    setOpenBurned(true);
  };
  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <MDBox>
        <Grid container spacing={6} pr={12} pl={12}>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox>
              <MDTypography
                variant="button"
                fontSize="24pt"
                color="dark"
                fontWeight="bold"
                marginRight="30px"
              >
                SOLANA CONTRACT DATA RETRIEVAL
              </MDTypography>
              <MDTypography
                variant="button"
                fontSize="24pt"
                color="info"
                fontWeight="bold"
                fontStyle="italic"
              >
                ({symbol == "" ? "SYMBOL" : symbol})
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={24} md={12} lg={6}>
            <MDBox display="flex" width="100%">
              {status === Status.NONE || status === Status.FINISHED || status === Status.PAUSED ? (
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={onStart}
                  style={{ marginRight: "40px" }}
                  startIcon={<PlayCircleFilledWhiteOutlinedIcon size={50} />}
                >
                  Start
                </MDButton>
              ) : (
                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={onPause}
                  style={{ marginRight: "40px" }}
                  startIcon={<CircularProgress size={20} color="info" />}
                >
                  Pause
                </MDButton>
              )}
              <MDInput
                label="SOLANA CONTRACT ADDRESS"
                onChange={(e) => Change(e)}
                onKeyUp={onEnter}
                value={contractAdd}
                fullWidth
                maxLength="44"
                disabled={!action}
              />
              <MDButton variant="gradient" color="info" onClick={onOk} disabled={!action}>
                OK
              </MDButton>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
                disabled={!action}
              >
                <Badge badgeContent={status ? 1 : 0} color="primary">
                  <Icon sx={{ color: "error", fontSize: "20" }}>notifications</Icon>
                </Badge>
              </IconButton>
              {status == 1 ? renderMenu() : null}
              <IconButton aria-label="delete" color="error" onClick={onSetting} disabled={!action}>
                <SettingIcon />
              </IconButton>
              <Modal
                open={settingStatus}
                onClose={() => setSettingStatus(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h2">
                    FILTER SETTING
                  </Typography>
                  <Grid>
                    <Grid container pr={2} pl={2} pt={4}>
                      <Grid item xs={24} md={12} lg={4}>
                        Pre-mined(%)
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          value={premined}
                          onChange={handleChangePremined}
                          valueLabelDisplay="auto"
                          getAriaValueText={makePercentText}
                          disableSwap
                        />
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={1}>
                      <Grid item xs={24} md={12} lg={4}>
                        AMM(%)
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          value={amm}
                          onChange={handleChangeAmm}
                          valueLabelDisplay="auto"
                          getAriaValueText={makePercentText}
                          disableSwap
                        />
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={1}>
                      <Grid item xs={24} md={12} lg={4}>
                        L Liquidity(%)
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          value={locked}
                          onChange={handleChangeLocked}
                          valueLabelDisplay="auto"
                          getAriaValueText={makePercentText}
                          disableSwap
                        />
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={1}>
                      <Grid item xs={24} md={12} lg={4}>
                        POOLED SOL(sol)
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          value={sol}
                          min={0}
                          max={1000}
                          onChange={handleChangePooledSOL}
                          valueLabelDisplay="auto"
                          getAriaValueText={makeSolText}
                          disableSwap
                        />
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={1}>
                      <Grid item xs={24} md={12} lg={4}>
                        Mint Authority Revoked
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Select
                          id="demo-controlled-open-select-label"
                          open={openMint}
                          onClose={handleCloseMint}
                          onOpen={handleOpenMint}
                          value={mint}
                          onChange={handleChangeMint}
                          sx={{ ml: 1, width: 180, height: 30 }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="yes">YES</MenuItem>
                          <MenuItem value="no">NO</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={1}>
                      <Grid item xs={24} md={12} lg={4}>
                        Liquidity Burned
                      </Grid>
                      <Grid item xs={24} md={12} lg={8}>
                        <Select
                          id="demo-controlled-open-select-label"
                          open={openBurned}
                          onClose={handleCloseBurned}
                          onOpen={handleOpenBurned}
                          value={burned}
                          onChange={handleChangeBurned}
                          sx={{ ml: 1, width: 180, height: 30 }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="yes">YES</MenuItem>
                          <MenuItem value="no">NO</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid container pr={2} pl={2} pt={3}>
                      <Grid item xs={24} md={12} lg={5}></Grid>
                      <Grid item xs={24} md={12} lg={4}>
                        <MDButton variant="gradient" color="error" onClick={onSave}>
                          SAVE
                        </MDButton>
                      </Grid>
                      <Grid item xs={24} md={12} lg={3}></Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDSnackbar
        color="success"
        icon="check"
        title="Success"
        content="You successfully saved Filter Setting"
        dateTime="now"
        open={alertStatus}
        onClose={closeAlert}
        close={closeAlert}
        bgWhite
      />
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  action: PropTypes.bool,
  status: PropTypes.number,
  setFilter: PropTypes.func,
  callback: PropTypes.func,
  setAction: PropTypes.func,
  setStatus: PropTypes.func,
  setAutoMode: PropTypes.func,
  setAutoNewTokens: PropTypes.func,
  symbol: PropTypes.string,
  contractAdd: PropTypes.string,
  setContractAdd: PropTypes.func,
};

export default DashboardNavbar;
