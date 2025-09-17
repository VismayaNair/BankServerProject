using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required, StringLength(100)]
        public string UserId { get; set; } // FK → ApplicationUser

        [Required, StringLength(30)]
        public string Role { get; set; } // Teller, LoanOfficer, Manager

        [Required, StringLength(50)]
        public string BranchName { get; set; }
    }
}
