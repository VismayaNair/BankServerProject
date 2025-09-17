
namespace BankServer.DTOs
{
    public class AccountDTO
    {
        public int AccountId { get; set; }    // Unique account ID
        public int CustId { get; set; }       // Link to Customer
        public string AccountType { get; set; } // e.g., Savings / Current
        public decimal Balance { get; set; }    // Current balance
    }
}
