// src/components/LoanDropdown.jsx
import React, { useState } from "react";
import "../styles/LoanDropdown.css";

export default function LoanDropdown({ loans, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (loan) => {
    setSelected(loan);
    setOpen(false);
    onSelect(loan);
  };

  const getStatusClass = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === "approved" || normalized === "approve") return "approved";
    if (normalized === "pending") return "pending";
    if (normalized === "rejected") return "rejected";
    return "";
  };

  return (
    <div className="loan-dropdown">
      <div className="loan-selected" onClick={() => setOpen(!open)}>
        {selected
          ? `${selected.loanProductName} — ${selected.status}`
          : "Select Loan"}
      </div>

      {open && (
        <ul className="loan-options">
          {loans.length === 0 ? (
            <li className="loan-option disabled">No loans available</li>
          ) : (
            loans.map((loan) => (
              <li
                key={loan.loanApplicationId}
                className={`loan-option ${getStatusClass(loan.status)}`}
                onClick={() => handleSelect(loan)}
              >
                {loan.loanProductName} — {loan.status}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
