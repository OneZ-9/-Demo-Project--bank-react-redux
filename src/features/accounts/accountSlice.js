// Automatically create action creators from reducers
// It make writing reducers lot more easier, no longer need switch cases and default case automatically handled
// Now we can mutate states inside reducers (immer will convert logics again immutable behind the scenes)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      // now we can write mutating logic
      // no longer return entire state, we just edit what we wanted

      state.balance = state.balance + action.payload;
      // state.balance += action.payload;
      state.isLoading = false;
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },

    withdraw(state, action) {
      state.balance -= action.payload;
    },

    requestLoan: {
      prepare(amount, purpose) {
        // this become the payload object for reducer
        // with this we can recieve more than one value for payload
        return { payload: { amount, purpose } };
      },
      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },

    payLoan(state) {
      // need to pay attention to the order
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
  },
});

// console.log(accountSlice);

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

// for deposit action creator now we goint to use own one and removed from account slice export which automatically created
// make sure to have action type in same shape name of the slice and name of the reducer (account/deposit)
export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });

    // API call
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;

    // return action
    dispatch({ type: "account/deposit", payload: converted });
  };
}

export default accountSlice.reducer;
