import wordBank from "./wordle-bank.txt";
import wordBankro from "./wordle-bank-ro.txt";
import axios from 'axios';

export const boardDefault = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export const generateWordSet = async (wordCode) => {

  let todaysWord;
  try {
    const response = await axios.get(`https://localhost:7020/api/Word/${wordCode}`);
    if (response.status === 200) {
      todaysWord = response.data.value; // Assuming response.data.value contains the word
      todaysWord = todaysWord.replace(/\r$/, '');
    } else {
      console.error('Failed to fetch word');
    }
  } catch (error) {
    console.error('Error fetching word:', error);
  }
  

  let wordSet;
  if(wordCode === 1) {
    await fetch(wordBank)
      .then((response) => response.text())
      .then((result) => {
        const wordArr = result.split("\n");
        wordSet = new Set(wordArr);
      });
  }
  else if(wordCode === 2) {
    await fetch(wordBankro)
      .then((response) => response.text())
      .then((result) => {
        const wordArr = result.split("\n");
        const cleanedWordArr = wordArr.map(word => word.replace(/\r$/, ''));
        wordSet = new Set(cleanedWordArr);
      });
  }
  return { wordSet, todaysWord };
};
