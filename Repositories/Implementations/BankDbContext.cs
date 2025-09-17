using BankServer.Models;
using Microsoft.EntityFrameworkCore;

namespace BankServer.Repositories
{
    public class BankDbContext : DbContext
    {
        public BankDbContext(DbContextOptions<BankDbContext> options) : base(options)
        {
        }

        // DbSets for all your models
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<LoanProduct> LoanProducts { get; set; }
        public DbSet<LoanApplication> LoanApplications { get; set; }
        public DbSet<LoanRepayment> LoanRepayments { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<AccountStatement> AccountStatements { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
    }
}
