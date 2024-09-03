using Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class ApiContext(DbContextOptions<ApiContext> options):IdentityDbContext<AppUser>(options)
{
    
}