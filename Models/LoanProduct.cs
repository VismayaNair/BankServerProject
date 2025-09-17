using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class LoanProduct
    {
        [Key]
        public int LoanProductId { get; set; }

        [Required, StringLength(50)]
        public string Name { get; set; }

        [Required]
        public decimal InterestRate { get; set; }

        [Required]
        public int TenureMonths { get; set; }
    }
}
