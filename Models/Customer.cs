using System;
using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required, StringLength(100)]
        public string UserId { get; set; } // FK → ApplicationUser

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required, StringLength(12)]
        public string AadharNumber { get; set; }

        [Required, StringLength(10)]
        public string PANNumber { get; set; }
        
    


        public bool FullName()
        {
            throw new NotImplementedException();
        }
    }
}
