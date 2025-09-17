
namespace BankServer.DTOs
{
    public class CustomerDTO
    {
        public int CustId { get; set; }       // Unique ID for customer
        public string Name { get; set; }      // Customer name
        public string Email { get; set; }     // Email
        public string Phone { get; set; }     // Phone number
    }
}
