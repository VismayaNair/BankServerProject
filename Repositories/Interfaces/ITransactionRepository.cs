using BankServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Interfaces
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<Transaction> GetByIdAsync(int id);
        Task<Transaction> AddAsync(Transaction transaction); // returns created entity
        Task UpdateAsync(Transaction transaction);
        Task DeleteAsync(int id);
    }
}
