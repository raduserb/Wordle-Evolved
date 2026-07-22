from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from game import WordleGame
from algorithms import HumanAlgorithm
from algorithms import NaiveFrequencyAlgorithm

app = Flask(__name__)
CORS(app)

def get_random_word():
    words = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'pink']
    return random.choice(words)

@app.route('/api/get_random_word', methods=['GET'])
def random_word():
    # Run your function and get the result
    result = get_random_word()

    # Return the result as a JSON response
    return jsonify(result=result)

@app.route('/api/get_hint', methods=['GET'])
def get_hint():
    # Set the hint message
    hint_message = 'This is your hint pula pula!'
    
    # Return the hint message as a JSON response
    return jsonify(hint=hint_message)

@app.route('/api/get_first_letters', methods=['GET'])
def get_first_letters():
    # Get the list of words from the request arguments
    words = request.args.get('words', '').split(',')

    # Get the first letter of each word and concatenate them
    result = ''.join(word[0] for word in words)

    # Return the result as a JSON response
    return jsonify(result=result)

@app.route('/api/run_algorithm', methods=['GET'])
def run_algorithm():
    # Get the list of words from the request arguments
    words = request.args.get('words', '').split(',')

    if not words:
        return jsonify(error="No words provided"), 400

    game = WordleGame()
    algo = NaiveFrequencyAlgorithm(word_list=game.get_word_list())

    game.answer = words[0]
    current_guesses = words[1:]
    print ("amswer", game.answer)

    final_guess = "canoe"

    for guess in current_guesses:
        print(guess)
        game.guess(guess)
        game_last_guess = game.get_last_guess()
        try:
            final_guess = algo.make_guess(game_last_guess)
        except IndexError:
            final_guess = words[0]

    print("remaining words: ", algo.remaining_word_list)

    return jsonify(answer=game.answer, final_guess=final_guess)

@app.route('/api/get_possible_words', methods=['GET'])
def get_possible_words():
    # Get the list of words from the request arguments
    words = request.args.get('words', '').split(',')

    if not words:
        return jsonify(error="No words provided"), 400

    game = WordleGame()
    algo = HumanAlgorithm(word_list=game.get_word_list())

    game.answer = words[0]
    current_guesses = words[1:]
    print("answer", game.answer)

    remaining_words = []
    
    for guess in current_guesses:
        print(guess)
        game.guess(guess)
        game_last_guess = game.get_last_guess()
        try:
            algo.make_guess(game_last_guess)
        except IndexError:
            remaining_words = [words[0]]
            break

    if not remaining_words:
        remaining_words = algo.remaining_word_list

    # Return up to 10 remaining words (or fewer if there are fewer than 10)
    max_words = min(len(remaining_words), 12)
    result = remaining_words[:max_words]

    return jsonify(possible_words=result)


@app.route('/api/run_algorithm_ro', methods=['GET'])
def run_algorithm_ro():
    # Get the list of words from the request arguments
    words = request.args.get('words', '').split(',')

    if not words:
        return jsonify(error="No words provided"), 400

    game = WordleGame()
    words_file = open('word_lists/default_words-ro.txt', 'r')
    word_list_ro = [word for word in words_file.read().splitlines()]
    words_file.close()
    game.set_word_list(word_list_ro)
    algo = NaiveFrequencyAlgorithm(word_list=game.get_word_list())

    game.answer = words[0]
    current_guesses = words[1:]
    print("answer:", game.answer)

    final_guess = "canoe"

    for guess in current_guesses:
        print(guess)
        game.guess(guess)
        game_last_guess = game.get_last_guess()
        try:
            final_guess = algo.make_guess(game_last_guess)
        except IndexError:
            final_guess = words[0]

    print("remaining words:", algo.remaining_word_list)

    return jsonify(answer=game.answer, final_guess=final_guess)

@app.route('/api/get_possible_words_ro', methods=['GET'])
def get_possible_words_ro():
    # Get the list of words from the request arguments
    words = request.args.get('words', '').split(',')

    if not words:
        return jsonify(error="No words provided"), 400

    game = WordleGame()
    words_file = open('word_lists/default_words-ro.txt', 'r')
    word_list_ro = [word for word in words_file.read().splitlines()]
    words_file.close()
    game.set_word_list(word_list_ro)
    algo = HumanAlgorithm(word_list=game.get_word_list())

    game.answer = words[0]
    current_guesses = words[1:]
    print("answer:", game.answer)

    remaining_words = []
    
    for guess in current_guesses:
        print(guess)
        game.guess(guess)
        game_last_guess = game.get_last_guess()
        try:
            algo.make_guess(game_last_guess)
        except IndexError:
            remaining_words = [words[0]]
            break

    if not remaining_words:
        remaining_words = algo.remaining_word_list

    # Return up to 10 remaining words (or fewer if there are fewer than 10)
    max_words = min(len(remaining_words), 12)
    result = remaining_words[:max_words]

    return jsonify(possible_words=result)


if __name__ == '__main__':
    app.run(debug=True)
