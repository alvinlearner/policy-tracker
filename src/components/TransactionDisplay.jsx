import React, { useEffect, useState } from "react";
import TransactionFilter from "./TransactionFilter";
import TransactionDelete from "./TransactionDelete";

export default function DisplayTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const url = `https://policy-tracker-data.vercel.app/transactions`;

    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const transactionsWithDays = data.map((transaction) => ({
          ...transaction,
          daysLeft: calculateDaysLeft(transaction.start, transaction.expire),
          daysPassed: calculateDaysPassed(transaction.expire),
        }));
        setTransactions(transactionsWithDays);
        setFilteredTransactions(transactionsWithDays);
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

  const calculateDaysPassed = (expire) => {
    const currentDate = new Date();
    const expireDate = new Date(expire);

    expireDate.setHours(23, 59, 59, 999);

    const passedDays = Math.floor((currentDate - expireDate) / (1000 * 60 * 60 * 24));
    return passedDays >= 0 ? passedDays : "-";
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTransactions].sort((a, b) => {
      let aValue, bValue;

      if (key === "daysLeft") {
        aValue = calculateDaysLeft(a.start, a.expire);
        bValue = calculateDaysLeft(b.start, b.expire);
      } else if (key === "daysPassed") {
        aValue = a.daysPassed === "-" ? -1 : a.daysPassed;
        bValue = b.daysPassed === "-" ? -1 : b.daysPassed;
      } else {
        aValue = a[key];
        bValue = b[key];
      }

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
    const url = `https://policy-tracker-data.vercel.app/transactions/${id}`;
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
  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #89b1d6;
    cursor:pointer;
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

  @media only screen and (max-width: 600px) {
    /* Styles specific to mobile view */
    th, td {
      white-space: nowrap; /* Prevent text wrapping */
    }
  }

  
  `}
</style>


      <TransactionFilter transactions={transactions} onFilter={handleFilter}/>

  <div className="table-container">
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
            <th onClick={() => handleSort("daysPassed")}>Days passed</th>
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
              <td>{transaction.daysPassed}</td>
              {/* <td>
                <TransactionDelete
                  id={transaction.id}
                  onDelete={() => handleDelete(transaction.id)}
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}








