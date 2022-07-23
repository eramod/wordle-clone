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

Data definitions
  [X] Set up word list of allowed words. Copy from the official Wordle game.
  [X] Set up a tracked array property of all the guesses
  [X] Set up a max guesses property (6)
  [X] Word of the day, chosen at "random" daily from the master list
  [X] Guess count

To Do List:
[X] Install typescript
[X] Create keyboard that recognizes letters entered and can update a `currentGuess` property in the UI
  [X] Fix keyboard bug: At the moment, any key pressed will add to the currentGuess. User should not be able to add a key to the current guess if it's not in the game's keyboard.
[X] CSS for keyboard
[X] Handle click event on letter keys so user can use the game's keyboard to enter letters
[X] Implement `backspace` for both the click event on the game's keyboard and the keyup event from typing on the real keyboard. Take a substring of the current guess that does not include the last letter.
[X] UI: Add a representation of the user's guesses, with the current one being editable
  [X] Start with a hard coded list of guesses just so you can show it in the UI
[ ] CSS for guesses display
[ ] Implement game logic - see game definition when you're ready to add more detail to this section
[ ] Add enter key functionality
  [ ] If guess matches word of the day, alert user you win!
  [ ] If guess is not in the word list, alert user "Not in word list"
  [ ] If guess is too short, alert user "Not enough letters"
  [ ] If guess has already been guessed, alert user "Already guessed"
[ ] Replace alerts with a "toast" (a pop-up that disappears)
[ ] Implement end of game functionality. If user guess matches word of the day, alert "You win!". If user runs out of guesses, alert "Better luck next time".
[ ] CSS for guesses (animation and colors to indicate how letters in a guess compare to the word of the day, green if in the word in the correct spot, yellow if in the word but in the wrong spot, gray if not in the word) and keyboard (colors to match guess colors)

Stretch goals:
[ ] Implement end game share functionality
[ ] Implement strict mode
[ ] Handle touch events so a user can play on a phone
