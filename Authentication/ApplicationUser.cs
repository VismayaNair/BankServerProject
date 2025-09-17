using Microsoft.AspNetCore.Identity;
using System;

namespace BankServer.Authentication
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ContactNumber { get; set; }
    }
}
