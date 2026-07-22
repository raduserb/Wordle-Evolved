using System.ComponentModel.DataAnnotations;

namespace WordleEvolved.Dto
{
    public class UserRegistrationRequestDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
