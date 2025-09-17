using System.ComponentModel.DataAnnotations;

namespace BankServer.Models
{
    public class Beneficiary
    {
        [Key]
        public int BeneficiaryId { get; set; }

        [Required]
        public int CustomerId { get; set; } // FK → Customer

        [Required, StringLength(100)]
        public string BeneficiaryName { get; set; }

        [Required, StringLength(20)]
        public string AccountNumber { get; set; }

        [Required, StringLength(50)]
        public string BankName { get; set; }

        [Required, StringLength(50)]
        public string BranchName { get; set; }

        [Required, StringLength(11)]
        public string IFSCCode { get; set; }
    }
}
