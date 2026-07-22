using System.ComponentModel.DataAnnotations;

namespace WordleEvolved.Dto
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
