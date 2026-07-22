from flask import Flask, jsonify
from flask_cors import CORS
import random

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

if __name__ == '__main__':
    app.run(debug=True)
