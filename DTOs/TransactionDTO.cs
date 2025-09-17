
using System;

namespace BankServer.DTOs
{
    public class TransactionDTO
    {
        public int TransactionId { get; set; }      // Unique transaction ID
        public int AccountId { get; set; }          // Link to Account
        public string TransactionType { get; set; } // "Deposit" or "Withdrawal"
        public decimal Amount { get; set; }         // Amount of transaction
        public DateTime TransactionDate { get; set; } // Date of transaction
    }
}
