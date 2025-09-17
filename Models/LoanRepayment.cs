using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class LoanRepayment
    {
        [Key]
        public int RepaymentId { get; set; }

        [Required]
        public int LoanApplicationId { get; set; }

        [Required]
        public decimal AmountPaid { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [Required]
        public decimal BalanceRemaining { get; set; }
    }
}
