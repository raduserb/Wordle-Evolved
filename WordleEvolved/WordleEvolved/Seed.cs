using System.Diagnostics;
using WordleEvolved.Data;
using WordleEvolved.Models;

namespace WordleEvolved
{
    public class Seed
    {
        private readonly DataContext dataContext;
        public Seed(DataContext context)
        {
            this.dataContext = context;
        }
        public void SeedDataContext()
        {
            /*if(false)
            {

                if(!dataContext.UserStatistsicsAchievements.Any())
                {
                    var userStatistsicsAchievements = new List<UserStatisticsAchievement>()
                    {
                        new UserStatisticsAchievement()
                        {
                            UserStatistics = new UserStatistics()
                            {
                                GamesPlayed = 4,
                                Wins = 2,
                                Losses = 2,
                                //UserStatistsicsAchievements = new List<UserStatistsicsAchievement>()
                                //{
                                //    new UserStatistsicsAchievement { Achievement = new Achievement() { AchievementName = "Zeul", AchievementDescription = "Ai devenit zeu"}}
                                //}
                            },
                            Achievement = new Achievement()
                            {
                                AchievementName = "Zeul",
                                AchievementDescription = "Ai devenit zeu"
                            }
                        },
                        new UserStatisticsAchievement()
                        {
                            UserStatistics = new UserStatistics()
                            {
                                GamesPlayed = 12,
                                Wins = 9,
                                Losses = 3,
                            },
                            Achievement = new Achievement()
                            {
                                AchievementName = "getting there bro",
                                AchievementDescription = "bravo devi mai bun"
                            }
                        },
                        new UserStatisticsAchievement()
                        {
                            UserStatistics = new UserStatistics()
                            {
                                GamesPlayed = 108,
                                Wins = 68,
                                Losses = 40,
                            },
                            Achievement = new Achievement()
                            {
                                AchievementName = "god of war",
                                AchievementDescription = "kratos"
                            }
                        }
                    };
                    dataContext.UserStatistsicsAchievements.AddRange(userStatistsicsAchievements);
                    dataContext.SaveChanges();
                }
                else
                {
                    var user1 = new User
                    {
                        UserName = "user1",
                        Password = "password1",
                        Email = "user1@example.com",
                        Role = "user",
                        UserStatistics = new UserStatistics
                        {
                            GamesPlayed = 4,
                            Wins = 2,
                            Losses = 2,
                        },
                        GameSessions = new List<GameSession>()
                    };

                    var user2 = new User
                    {
                        UserName = "user2",
                        Password = "password2",
                        Email = "user2@example.com",
                        Role = "user",
                        UserStatistics = new UserStatistics
                        {
                            GamesPlayed = 12,
                            Wins = 9,
                            Losses = 3,
                        },
                        GameSessions = new List<GameSession>()
                    };

                    var user3 = new User
                    {
                        UserName = "user3",
                        Password = "password3",
                        Email = "user3@example.com",
                        Role = "user",
                        UserStatistics = new UserStatistics
                        {
                            GamesPlayed = 108,
                            Wins = 68,
                            Losses = 40,
                        },
                        GameSessions = new List<GameSession>()
                    };

                    var user4 = new User
                    {
                        UserName = "user4",
                        Password = "password4",
                        Email = "user4@example.com",
                        Role = "user",
                        UserStatistics = new UserStatistics
                        {
                            GamesPlayed = 100,
                            Wins = 60,
                            Losses = 40,
                        },
                        GameSessions = new List<GameSession>()
                    };

                    var user5 = new User
                    {
                        UserName = "user5",
                        Password = "password5",
                        Email = "user5@example.com",
                        Role = "sef",
                        UserStatistics = new UserStatistics
                        {
                            GamesPlayed = 101,
                            Wins = 60,
                            Losses = 41,
                        },
                        GameSessions = new List<GameSession>()
                    };

                    var users = new List<User> { user1, user2, user3, user4, user5 };
                    dataContext.Users.AddRange(users);

                    var words = new List<Word>
                    {
                        new Word { Value = "apple", LanguageId = 1 },
                        new Word { Value = "banana", LanguageId = 1 },
                        new Word { Value = "orange", LanguageId = 1 },
                        new Word { Value = "horse", LanguageId = 1 },
                        new Word { Value = "beer", LanguageId = 1 },
                        new Word { Value = "train", LanguageId = 1 }
                    };
                    dataContext.Words.AddRange(words);

                    var random = new Random();
                    foreach (var user in users)
                    {
                        for (int i = 0; i < 5; i++) // Assuming each user has 5 game sessions
                        {
                            var gameSession = new GameSession
                            {
                                LanguageId = 1,
                                NrGuesses = random.Next(1, 10), // Random number of guesses
                                Result = "win", // Assuming all sessions are wins for simplicity
                                Word = words[random.Next(words.Count)], // Randomly select a word
                                User = user
                            };
                            user.GameSessions.Add(gameSession);
                            dataContext.GameSessions.Add(gameSession);
                        }
                    }



                    dataContext.SaveChanges();
                }
            }*/

            /*var wordsFromFile = File.ReadAllLines("wordle-bank.txt");

            // Iterate over the words
            foreach (var word in wordsFromFile)
            {
                // Create a new Word entity for each word
                var wordEntity = new Word { Value = word, LanguageId = 1 };

                // Add the Word entity to the Words DbSet
                dataContext.Words.Add(wordEntity);
            }

            // Save the changes to the database
            dataContext.SaveChanges();*/

            var wordsFromFile = File.ReadAllLines("wordle-bank-ro.txt");

            // Iterate over the words
            foreach (var word in wordsFromFile)
            {
                // Create a new Word entity for each word
                var wordEntity = new Word { Value = word, LanguageId = 2 };

                // Add the Word entity to the Words DbSet
                dataContext.Words.Add(wordEntity);
            }

            // Save the changes to the database
            dataContext.SaveChanges();


        }
    }
}
