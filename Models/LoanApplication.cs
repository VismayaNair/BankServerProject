using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class LoanApplication
    {
        [Key]
        public int ApplicationId { get; set; }

        [Required]
        public int CustomerId { get; set; } // FK → Customer

        [Required]
        public int LoanProductId { get; set; } // FK → LoanProduct

        [Required]
        public decimal AmountRequested { get; set; }

        [StringLength(200)]
        public string Purpose { get; set; }

        [Required]
        public DateTime ApplicationDate { get; set; } = DateTime.Now;

        [Required, StringLength(20)]
        public string Status { get; set; } // Pending, Approved, Rejected, Disbursed
    }
}
