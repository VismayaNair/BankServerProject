using BankServer.Models;

namespace BankServer.Repositories.Interfaces
{
    public interface IAccountRepository
    {
        Task<IEnumerable<Account>> GetAllAsync();
        Task<Account> GetByIdAsync(int id);
        Task<Account> AddAsync(Account account); // returns created entity
        Task UpdateAsync(Account account);
        Task DeleteAsync(int id);
    }
}
