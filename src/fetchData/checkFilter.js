import * as Status from "../config/constants";

const CheckFilter = (total, prePct, filter) => {
  const mint = total.mintAuthority == null ? "no" : "yes";
  const sol = total.sol;
  const liquidity = total.liquidity.lpLockedPct ? total.liquidity.lpLockedPct : 0;
  console.error(prePct, filter);

  if (filter.premined[0] > 0 && filter.premined[1] < 100) {
    if (Number(prePct) < filter.premined[0] || Number(prePct) > filter.premined[1]) {
      console.warn("The range of Pre-mined PCT is out of filter!");
      return Status.STOPPING;
    }
  }

  if (Number(sol) > Number(filter.sol)) {
    console.warn("The range of SOL is out of filter!");
    return Status.STOPPING;
  }

  // if (Number(total.amm) < filter.amm[0] || Number(total.amm) > filter.amm[1]) {
  //   console.warn("The range of AMM is out of filter!");
  //   return Status.STOPPING;
  // }

  // if (Number(liquidity) < filter.locked[0] || Number(liquidity) > filter.locked[1]) {
  //   console.warn("The liquidity of Locked PCT is out of filter!");
  //   return Status.STOPPING;
  // }

  // if (filter.mint != "" && mint != filter.mint) {
  //   console.warn("The authority of MINT is not the same!");
  //   return Status.STOPPING;
  // }

  // if (filter.burned != "" && mint == filter.burned) {
  //   console.warn("The authority of Liquidity Burned is not the same!");
  //   return Status.STOPPING;
  // }

  return Status.FINISHED;
};

export default CheckFilter;
