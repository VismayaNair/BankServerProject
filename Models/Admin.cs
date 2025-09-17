using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        [Required, StringLength(100)]
        public string UserId { get; set; } // FK → ApplicationUser

        [Required, StringLength(100)]
        public string Privileges { get; set; } // ManageEmployees, Reports, etc.
    }
}
