import { connect, useSelector } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

// function BalanceDisplay() {
//   const balance = useSelector((store) => store.account.balance);

//   return <div className="balance">{formatCurrency(balance)}</div>;
// }

// export default BalanceDisplay;

function BalanceDisplay({ balance }) {
  return <div className="balance">{formatCurrency(balance)}</div>;
}

function mapSatetToProps(state) {
  return {
    balance: state.account.balance,
  };
}

export default connect(mapSatetToProps)(BalanceDisplay);
