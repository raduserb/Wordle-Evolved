using WordleEvolved.Models;

namespace WordleEvolved.Interfaces
{
    public interface IWordRepository
    {
        public ICollection<Word> GetWords();

        Word GetWord(int id);

        Word GetWord(string word);

        bool WordExists(int id);

        bool CreateWord(Word word);
        bool DeleteWord(int id);
        bool UpdateWord(Word word);
        bool Save();
    }
}