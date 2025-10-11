import React, { useEffect, useState } from "react";
import { getAllCustomers, deleteCustomer } from "../api/customer";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    loadCustomers();
  };

  return (
    <div>
      <h2>Customer Details</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Date of Birth</th>
            <th>PAN</th>
            <th>Aadhar</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.userId}>
              <td>{c.userId}</td>
              <td>{c.dateOfBirth}</td>
              <td>{c.panNumber}</td>
              <td>{c.aadharNumber}</td>
              <td>
                <button onClick={() => handleDelete(c.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
