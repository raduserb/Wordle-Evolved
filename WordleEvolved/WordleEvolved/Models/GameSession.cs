namespace WordleEvolved.Models
{
    public class GameSession
    {
        public int GameSessionId { get; set; }
        public int LanguageId { get; set; }
        public int NrGuesses { get; set; }
        public string Result { get; set; }
        public Word Word { get; set; }

        public User User { get; set; }
    }
}