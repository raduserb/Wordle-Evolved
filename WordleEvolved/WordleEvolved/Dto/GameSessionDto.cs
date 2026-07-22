namespace WordleEvolved.Dto
{
    public class GameSessionDto
    {
        public int GameSessionId { get; set; }
        public int LanguageId { get; set; }
        public int NrGuesses { get; set; }
        public string Result { get; set; }
    }
}
