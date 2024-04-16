import { createStore } from "redux";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

// Goal of the reducer is calculate next state based on the current state and on the recieved action
// Reducers are not allowed to modify the existing state and not allowed to do any async logic for other side effects
// function reducer(state, action) {}

// A difference between useReducer and Redux is we directly pass the initial state as the default state
function reducer(state = initialState, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };

    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };

    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };

    default:
      // We do not throw error here like normal useReducer, insted return original state
      //   throw new Error("Unknown action");
      return state;
  }
}

const store = createStore(reducer);

// store.dispatch({ type: "account/deposit", payload: 500 });
// console.log(store.getState());

// store.dispatch({ type: "account/withdraw", payload: 200 });
// console.log(store.getState());

// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 1000, purpose: "Buy a car" },
// });
// console.log(store.getState());

// store.dispatch({ type: "account/payLoan" });
// console.log(store.getState());

// Redux is working fine without Action creators, however its a developers convention to create action creators
// Action creators are just a functions that returns actions
function deposit(amount) {
  return { type: "account/deposit", payload: amount };
}
function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount: amount, purpose: purpose },
  };
}
function payLoan() {
  return { type: "account/payLoan" };
}

// Execute with dispatch
store.dispatch(deposit(500));
store.dispatch(withdraw(200));
console.log(store.getState());

store.dispatch(requestLoan(1000, "Buy a cheap car"));
console.log(store.getState());

store.dispatch(payLoan());
console.log(store.getState());
