from game import WordleGame
import random
import math
from itertools import product
import string
import pandas as pd
from os.path import exists
import copy
import sys

class BaseAlgorithm:
    '''
    Serves as the basis for how our algorithm should be structured
    and the methods that need to be implemented.
    '''
    def __init__(self, word_list, Verbose=False) -> None:
        self.word_list = word_list
        self.remaining_word_list = word_list
        self.Verbose = Verbose
        self.guesses = []
        self.bad_letters = []
        self.good_letters = []
        self.right_position = {}
        self.almost_position = {}
        self.wrong_position = {}   

    def reset(self):
        self.guesses = []
        self.bad_letters = []
        self.good_letters = []
        self.right_position = {}
        self.almost_position = {}
        self.wrong_position = {}

    def create_tree(self, word):
        '''
        This will need to be implemented for those who need a tree to conduct a search.

        Notes: I would make this so it updates based on a new root word then the possible words
        as branches or leafs.

        it may look something like https://www.poirrier.ca/notes/wordle/ except more simple.
        recursion might be useful for this.
        '''
        # TO-DO
        pass

    def make_guess(self) -> str:
        pass

    def make_first_guess(self) -> str:
        guess = random.choice(self.word_list)
        self.guesses.append(guess)
        return guess

    def update_information(self, previous_guess):
        p_guess, squares = previous_guess

        for idx, square in enumerate(squares):
            if square=="GREY":
                self.bad_letters.append(p_guess[idx])
            elif square == "YELLOW":
                if idx in self.almost_position:
                    # Append the letter to the existing list (if already present)
                    self.almost_position[idx].append(p_guess[idx])
                else:
                    # Initialize a new list with the letter
                    self.almost_position[idx] = [p_guess[idx]]
            if square=="GREEN":
                self.right_position[idx] = p_guess[idx]

        btemp = set()
        for i in self.bad_letters:
            if i not in self.good_letters:
                btemp.add(i)
        self.bad_letters = list(btemp)

    def update_remaining_words(self):
        print("\n\n\n\n")
        print("algo.bad_letters", self.bad_letters)
        print("algo.right_position", self.right_position)
        print("algo.almost_position", self.almost_position)
        print("algo.good_letters", self.good_letters)

        # print("Remaining words BEFORE: ", self.remaining_word_list)
        self.remaining_word_list = [
        word for word in self.word_list
            if all(word[i] == self.right_position.get(i, None) for i in self.right_position.keys())  # Ensure correct letters in the right positions
            and all(
                word[i] != almost_letter for i, letters in self.almost_position.items() for almost_letter in letters
            )  # Ensure almost letters are not in their specified positions
            and all(
                any(word[j] == almost_letter for j in range(len(word)) if j != i) for i, letters in self.almost_position.items() for almost_letter in letters
            )  # Ensure almost letters are present somewhere in the word but not in their specified positions
            and all(
                bad_letter not in word or (bad_letter in self.right_position.values()) for bad_letter in self.bad_letters
            )  # Exclude bad letters not in right position
            and word not in self.guesses  # Ensure the word is not a previous guess
        ]


        print("Remaining words AFTER: ", self.remaining_word_list)

class HumanAlgorithm(BaseAlgorithm):
    '''
    Meant to mimic the typical human strategy; picks a random word that
    is possible given the feedback on the most previous word.
    '''
    def __init__(self, word_list) -> None:
        super().__init__(word_list)

    def make_guess(self, previous_guess=None) -> str:
        if previous_guess==None:
            return super().make_first_guess()
        
        print("Previous Guess: ", previous_guess)

        super().update_information(previous_guess)
        super().update_remaining_words()
        
        guess = random.choice(self.remaining_word_list)
        self.guesses.append(guess)
        return guess

class NaiveFrequencyAlgorithm(BaseAlgorithm):
    '''
    Pick the words by counting the number of words a letter appears in and then selecting the word with
    aggregate highest number of its 5 letters

    We will ignore the duplicate characters in a word while calculating the aggregate

    Implementation inspired by - https://ido-frizler.medium.com/the-science-behind-wordle-67c8112ed0d1
    '''

    def __init__(self, word_list) -> None:
        super().__init__(word_list)

    def countCharacterFrequency(self) -> dict:
        countDict = {}
        for i in range(ord('a'),ord('z')+1):
            countDict[chr(i)] = 0
        for i in self.remaining_word_list:
            unique_chars = set(list(i.lower().strip()))
            for c in unique_chars:
                countDict[c]+=1
        return countDict

    def make_guess(self,previous_guess=None) -> str:
        if previous_guess==None:
            return super().make_first_guess()

        super().update_information(previous_guess)
        super().update_remaining_words()

        frequency = self.countCharacterFrequency()

        max_aggregate = 0
        guess = ""

        for i in self.remaining_word_list:
            agg_freq = 0
            for j in set(list(i.lower().strip())):
                agg_freq+=frequency[j]
            if(agg_freq>max_aggregate):
                max_aggregate = agg_freq
                guess = i
        self.guesses.append(guess)
        return guess



class MaxEntropyAlgorithm(BaseAlgorithm):
    '''
    Information Theory based implementation
    Guess the word by selecting the word with highest entropy from the available word list.
    It basically means that we want to reduce the number of possible words matching the existing pattern.
    The more small the space of possible words is after a guess, more will be the information gain.

    Implementation inspired by - https://towardsdatascience.com/information-theory-applied-to-wordle-b63b34a6538e
    Youtube(3 Blue 1 Brown) - https://youtu.be/v68zYyaEmEA
    '''

    def __init__(self, word_list) -> None:
        super().__init__(word_list)

    def calculate_entropy(self,word) -> float:
        patterns = {}
        for w in self.remaining_word_list:
            p = ""
            for i in range(len(w)):
                if w[i]==word[i]:
                    p+="g"
                elif w[i] in word:
                    p+="y"
                elif w[i] not in word:
                    p+="b"
            if p in patterns:
                patterns[p]+=1
            else:
                patterns[p]=1

        entropy = 0
        for k,v in patterns.items():
            if v!=0:
                prob = v/len(self.remaining_word_list)
                info = -1 * math.log(prob,2)
                entropy+=prob*info

        return entropy


    def make_guess(self,previous_guess=None) -> str:
        if previous_guess==None:
            return super().make_first_guess()

        super().update_information(previous_guess)
        super().update_remaining_words()

        max_entropy = 0
        guess = random.choice(self.remaining_word_list)

        for word in self.remaining_word_list:
            entropy = self.calculate_entropy(word)
            if(entropy>max_entropy):
                max_entropy = entropy
                guess = word

        self.guesses.append(guess)
        return guess


if __name__=="__main__":
    # manual tests on algorithms
    game = WordleGame()
    # 1. Human
    #algo = HumanAlgorithm(word_list=game.get_word_list())
    #2. Aggregated Frequency
    #algo = NaiveFrequencyAlgorithm(word_list=game.get_word_list())
    # 4. Greedy Depth
    #algo = GreedyDepthAlgorithm(word_list=game.get_word_list())
    # etc...

    choice = 1
    print("Select an Algorithm:\
          \n1.Human Algorithm\
          \n2.Aggregated Frequency\
          \n3.Entropy Maximization\
          \n4.Genetic Algorithm\
          \n5.Q-Learning")

    choice = int(input())
    if choice == 1:
        algo = HumanAlgorithm(word_list=game.get_word_list())
    else:
        print("Invalid choice. Exiting...")
        exit()

    algo = HumanAlgorithm(word_list=game.get_word_list())

    words = sys.argv[1:]

    game.answer = words[0]
    current_guesses = words[1:]

    for guess in current_guesses:
        game.guess(guess)
        print("game.get_last_guess(): ", game.get_last_guess())
        algo.make_guess(game.get_last_guess())

    game.guesses = current_guesses
    print("answer: ", game.answer)
    print("final guess: ", algo.make_guess(game.get_last_guess()))