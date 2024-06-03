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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";

// Data
import walletTableData from "../../layouts/tables/data/walletTableData";
import PropTypes from "prop-types";

function Tables({ tokenHolderList, total, loading }) {
  const { columns, rows } = walletTableData(tokenHolderList, total);
  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h5" color="white">
                PRE-MINED WALLET LIST
              </MDTypography>
            </MDBox>
            <MDBox pt={3} textAlign="center">
              {loading ? (
                <CircularProgress />
              ) : (
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                />
              )}
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}
Tables.defaultProps = {
  tokenHolderList: [],
};

// Typechecking props for the DataTable
Tables.propTypes = {
  tokenHolderList: PropTypes.array,
  total: PropTypes.object,
  loading: PropTypes.bool,
};
export default Tables;
