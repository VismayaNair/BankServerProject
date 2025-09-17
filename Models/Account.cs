using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        public int CustomerId { get; set; } // FK → Customer

        [Required, StringLength(20)]
        public string AccountNumber { get; set; }

        [Required, StringLength(20)]
        public string AccountType { get; set; } // Savings, Current, Business

        [Required, StringLength(50)]
        public string BranchName { get; set; }

        [Required, StringLength(11)]
        public string IFSCCode { get; set; }

        [Required]
        public decimal Balance { get; set; }

        [Required, StringLength(20)]
        public string Status { get; set; } // Active, Closed, Pending

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
