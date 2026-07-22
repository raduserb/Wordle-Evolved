using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using Microsoft.AspNetCore.Identity;

namespace WordleEvolved.Models
{
    [Table("AspNetUsers")]
    public class User : IdentityUser
    {
        public int UserId { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public UserStatistics UserStatistics { get; set; }
        public ICollection<GameSession> GameSessions { get; set; }

    }
}