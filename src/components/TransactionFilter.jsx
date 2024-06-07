import React, { useState } from "react";

export default function TransactionFilter({ transactions, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onFilter(
      transactions.filter((transaction) =>
        transaction.client.toLowerCase().includes(searchTerm.toLowerCase())||
        transaction.registration.toLowerCase().includes(searchTerm.toLowerCase())||
        transaction.policyno.toLowerCase().includes(searchTerm.toLowerCase())||
        transaction.classification.toLowerCase().includes(searchTerm.toUpperCase())
      )
    );
  };

  return (
    <div>
      <style>
        {`

.search {
    padding: 3px 10px; /* Adds space inside the button */
    background-color: #89b1d6;; /* Green background */
    color: white; /* White text color */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    font-size: 16px; /* Font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s, transform 0.3s; /* Smooth transition effects */

}



/* Hover effect */
.search:hover {
  background-color: #4d6377; /* Darker green on hover */
  transform: scale(1.05); /* Slightly larger on hover */
}

/* Focus effect */
.search:focus {
  outline: none; /* Removes default outline */
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.5); /* Adds a green glow effect */
}

/* Active effect */
.search:active {
  background-color: #3e8e41; /* Even darker green when pressed */
  transform: scale(0.95); /* Slightly smaller on press */
}


        `}
      </style>
    <div style={{ marginBottom: "10px" }}>
      <label style={{ marginRight: "10px" }}>Search description:</label>
      <input
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search" onClick={handleSearch}>Search</button>
    </div>
    </div>
  );
}
