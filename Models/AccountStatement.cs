using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class AccountStatement
    {
        [Key]
        public int StatementId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [Required]
        public DateTime GeneratedAt { get; set; } = DateTime.Now;
    }
}
