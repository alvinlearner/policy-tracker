import React, { useEffect, useState } from "react";
import TransactionFilter from "./TransactionFilter";
import TransactionDelete from "./TransactionDelete";

export default function DisplayTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const url = `http://localhost:3000/transactions`;

    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const transactionsWithDaysLeft = data.map((transaction) => ({
          ...transaction,
          daysLeft: calculateDaysLeft(transaction.start, transaction.expire),
        }));
        setTransactions(transactionsWithDaysLeft);
        setFilteredTransactions(transactionsWithDaysLeft);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculateDaysLeft = (start, expire) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const expireDate = new Date(expire);

    startDate.setHours(23, 59, 59, 999);
    expireDate.setHours(23, 59, 59, 999);

    const remainingDays = Math.floor((expireDate - currentDate) / (1000 * 60 * 60 * 24));
    return remainingDays >= 0 ? remainingDays : 0;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTransactions].sort((a, b) => {
      const aValue = key === "daysLeft" ? calculateDaysLeft(a.start, a.expire) : a[key];
      const bValue = key === "daysLeft" ? calculateDaysLeft(b.start, b.expire) : b[key];

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(sortedData);
  };

  const handleFilter = (filteredTransactions) => {
    setFilteredTransactions(filteredTransactions);
  };

  const handleDelete = (id) => {
    const url = `http://localhost:3000/transactions/${id}`;
    fetch(url, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    })
      .then(() => {
        const newTransactions = transactions.filter(
          (transaction) => transaction.id !== id
        );
        setTransactions(newTransactions);
        setFilteredTransactions(newTransactions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <style>
        {`
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #89b1d6;
}


th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #ddd;
}
        `}
      </style>
      <TransactionFilter transactions={transactions} onFilter={handleFilter} />
      <table>
        <thead>
          <tr>
          <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("client")}>Policy holder</th>
            <th onClick={() => handleSort("policyno")}>Policy no</th>
            <th onClick={() => handleSort("registration")}>Registration number</th>
            <th onClick={() => handleSort("classification")}>Classification</th>
            <th onClick={() => handleSort("start")}>Starting date</th>
            <th onClick={() => handleSort("expire")}>Expiry date</th>
            <th onClick={() => handleSort("daysLeft")}>Days left</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.client}</td>
              <td>{transaction.policyno}</td>
              <td>{transaction.registration}</td>
              <td>{transaction.classification}</td>
              <td>{transaction.start}</td>
              <td>{transaction.expire}</td>
              <td style={{ color: calculateDaysLeft(transaction.start, transaction.expire) > 0 ? 'black' : 'red' }}>
                {calculateDaysLeft(transaction.start, transaction.expire)} days left
              </td>
              <td>
                <TransactionDelete
                  id={transaction.id}
                  onDelete={() => handleDelete(transaction.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
