import React from "react";
import "./App.css";
import DisplayTransaction from "./components/TransactionDisplay";
import AddTransaction from "./components/TransactionPost";

function App() {
  return (
    <>
    <style>
      {
        `
        h1{
          text-align:center;
        }
        `
      }
    </style>
      <h1>Motor Policy Tracker</h1>
      {/* <AddTransaction /> */}
      <DisplayTransaction />
    </>
  );
}

export default App;
