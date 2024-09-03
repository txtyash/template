using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class AppUser:IdentityUser
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;
    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = null!;

    // DateTime.UtcNow: for sites being used globally
    // DateTime.UtcNow: for sites being used in the same timezone
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}