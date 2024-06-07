import React, { useState, useEffect } from "react";

function AddTransaction() {
  const [client, setClient] = useState("");
  const [policyno, setPolicyno] = useState("");
  const [registration, setRegistration] = useState("");
  const [classification, setClassification] = useState("TPO");
  const [start, setStart] = useState("");
  const [expire, setExpire] = useState("");
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    fetch(`https://policy-tracker-data.vercel.app/transactions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const maxId = Math.max(...data.map((transaction) => transaction.id));
          setNextId(maxId + 1);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: nextId,
      client: client,
      policyno: policyno,
      registration: registration,
      classification: classification,
      start: start,
      expire: expire,
    };

    fetch(`https://policy-tracker-data.vercel.app/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClient("");
        setPolicyno("");
        setRegistration("");
        setClassification("TPO");
        setStart("");
        setExpire("");
        setNextId(nextId + 1); // Increment the next ID for future transactions
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleExpireDateChange = (e) => {
    const expireDate = e.target.value;
    setExpire(expireDate);

    const startDate = new Date(expireDate);
    startDate.setDate(startDate.getDate() - 364);
    setStart(startDate.toISOString().split("T")[0]);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Client:
          <input
            type="text"
            value={client}
            placeholder="Enter client name"
            onChange={(e) => setClient(e.target.value)}
            style={styles.input}
          />
        </label>
        
        <label style={styles.label}>
          Policy no:
          <input
            type="text"
            value={policyno}
            placeholder="Enter policy number"
            onChange={(e) => setPolicyno(e.target.value)}
            style={styles.input}
          />
        </label>
        
        <label style={styles.label}>
          Registration number:
          <input
            type="text"
            value={registration}
            placeholder="Enter registration number"
            onChange={(e) => setRegistration(e.target.value.toUpperCase())}
            style={styles.input}
          />
        </label>
        
        <label style={styles.label}>
          Classification:
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            style={styles.input}
          >
            <option value="TPO">TPO</option>
            <option value="COMP">COMP</option>
          </select>
        </label>
        
        <label style={styles.label}>
          Expiry date:
          <input
            type="date"
            value={expire}
            onChange={handleExpireDateChange}
            style={styles.input}
          />
        </label>
        
        <label style={styles.label}>
          Start date:
          <input
            type="date"
            value={start}
            readOnly
            style={styles.input}
          />
        </label>
        
        <button type="submit" style={styles.button}>Add Transaction</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    maxWidth: "600px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
};

export default AddTransaction;
