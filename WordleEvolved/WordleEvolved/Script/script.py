import random

def get_random_word():
    words = ['dan', 'marius', 'cal', 'etc']
    return random.choice(words)

if __name__ == "__main__":
    print(get_random_word())
