import random

word_list = ["camel"]
chosen_word = random.choice(word_list)
word_length = len(chosen_word)

# Testing code
print(f'Pssst, the solution is {chosen_word}.')

# Create blanks
display = ["_" for _ in range(word_length)]

# TODO-1: Use a while loop to let the user guess again.
# The loop should only stop once the user has guessed all the letters
# in the chosen_word and 'display' has no more blanks ("_").
# Then you can tell the user they've won.
def guess_game():
    global display  # Use the global display variable inside the function
    while "_" in display:
        guess = input("Guess a letter: ").lower()
        for position in range(word_length):
            letter = chosen_word[position]
            if letter == guess:
                display[position] = letter
        print(display)

    print("Congratulations, you've guessed the word!")

guess_game()
