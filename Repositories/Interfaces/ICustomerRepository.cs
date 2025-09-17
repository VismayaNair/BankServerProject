using BankServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<Customer> GetByIdAsync(int id);
        Task<Customer> AddAsync(Customer customer); // returns created entity
        Task UpdateAsync(Customer customer);
        Task DeleteAsync(int id);
    }
}
