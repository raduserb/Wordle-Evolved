using WordleEvolved.Models;

namespace WordleEvolved.Interfaces
{
    public interface IUserRepository
    {
        public ICollection<User> GetUsers();

        User GetUser(int id);

        User GetUser(string username);

        bool UserExists(int id);

        ICollection<GameSession> GetGameSessionsByUserId(int userId);

        bool CreateUser(User user);
        bool UpdateUser(User user);
        void DeleteUserStatisticsByUserId(int userId);
        void DeleteGameSessionsByUserId(int userId);
        bool DeleteUser(int id);

        bool Save();

        public int GetNextUserId();
    }
}