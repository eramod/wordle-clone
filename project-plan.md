Game Definition

  - The object of Wordle is to guess the 5-letter word of the day
  - You get 6 guesses
  - You can only guess words that exist in Wordle's master list. If you guess a word that is not in the list, the program does not accept the guess.
  - When a valid guess is submitted, the guessing area flips each letter to reveal the color, which indicates how accurate each letter of your guess is. The keyboard matches the color to indicate information on the letters you've guessed (default keyboard color is light gray).
  - For each valid guess entered
      - if a letter is not in the word, it turns dark gray
      - if a letter is in the word, but not in the correct position, it turns yellow
      - if a letter is in the correct position in the word, it turns green
  - Possible extras
    - ability to share a grid with just the color pattern of your guesses
    - hard mode - once you've guessed a letter in the word correctly, you must use it in subsequent guesses

Data
  - Master list of words as array
  - Word of the day, chosen at random daily from the master list
  - List of guesses as array (or set?)
  - Current guess
  - Guess count
  - Max guess count


Component Design
- Game - keeps track of master list, word of the day, list of guesses, guess count, and max guess count
  - Guessing area
    - 6 Words (row)
      - Letter - color, action to change the color (can probably reuse)
  - Keyboard
    - Letter - color, action to change the color (can probably reuse)

To Do List:
[X] Install typescript
[X] Create keyboard that recognizes letters entered and can update a `currentGuess` property in the UI
  [X] Fix keyboard bug: At the moment, any key pressed will add to the currentGuess. User should not be able to add a key to the current guess if it's not in the game's keyboard.
[X] CSS for keyboard
[X] Handle click event on letter keys so user can use the game's keyboard to enter letters
[X] Implement `backspace` for both the click event on the game's keyboard and the keyup event from typing on the real keyboard. Take a substring of the current guess that does not include the last letter.
 
Stretch goals:
[ ] Implement end game share functionality
[ ] Implement strict mode
[ ] Handle touch events so a user can play on a phone
