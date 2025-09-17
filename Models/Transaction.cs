using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int AccountId { get; set; } // FK → Account

        [Required, StringLength(20)]
        public string TransactionType { get; set; } // Deposit, Withdraw, Transfer

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; } = DateTime.Now;

        [StringLength(200)]
        public string Description { get; set; }

        [Required, StringLength(20)]
        public string Status { get; set; } // Success, Failed, Pending
    }
}
