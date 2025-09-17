using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class AuditLog
    {
        [Key]
        public int LogId { get; set; }

        [Required, StringLength(100)]
        public string UserId { get; set; }

        [Required, StringLength(50)]
        public string Action { get; set; } // Login, Transaction, LoanApproval

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [StringLength(45)]
        public string IpAddress { get; set; }

        [StringLength(200)]
        public string Description { get; set; }
    }
}
