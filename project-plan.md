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
[X] CSS for guesses display
[X] Implement game logic - see game definition when you're ready to add more detail to this section
[X] Add enter key functionality
  [X] If guess matches word of the day, alert user you win!
  [X] If guess is not in the word list, alert user "Not in word list"
  [X] If guess is too short, alert user "Not enough letters"
[X] Implement end of game functionality. If user guess matches word of the day, alert "You win!". If user runs out of guesses, alert "Better luck next time".
[ ] Make `wordOfTheDay` update daily at midnight in the user's timezone
[ ] Replace Enter and Backspace keys on the virtual keyboard with icons
[ ] Refactor keyboard component. Need to create a game component that will call a guesses component and a keyboard component. Or just rename the keyboard component to game if you determine that the component doesn't seem big enough to split up.
[ ] Implementation and CSS for guesses (animation and colors to indicate how letters in a guess compare to the word of the day)
  [ ] green if in the word in the correct spot
  [ ] yellow if in the word but in the wrong spot
  [ ] gray if not in the word
  [ ] Need to deal with multiple letters in the same word as well
      [ ] If you guess a word with 2 of the same letters and there is only one of that letter, how do you deal with that? Maybe if one of them is in the correct spot that should be green, and if neither of them is in the correct spot the first one turns yellow.
[ ] Replace alerts with a "toast" (a pop-up that disappears)

Stretch goals:
[ ] Implement end game share functionality
[ ] Implement strict mode
[ ] Handle touch events so a user can play on a phone


Questions:



The basic steps of a function design recipe:
1. From Problem Analysis to Data Definitions
   Identify the information that must be represented and how it is represented in the chosen programming language. Formulate data definitions and illustrate them with examples. (Designer must: analyze a problem statement, typically stated as a word problem)

2. Signature, Purpose Statement, Header
   State what kind of data the desired function consumes and produces. Formulate a concise answer to the question what the function computes. Define a stub that lives up to the signature. (Designer must: extract and express its essence, abstractly)
3. Functional Examples
   Work through examples that illustrate the function???s purpose. (Designer must: illustrate the essence with examples)
4. Function Template
   Translate the data definitions into an outline of the function. (Designer must: make outlines and plans based on this analysis). This is where you design the signature of the function.
5. Function Definition
   Fill in the gaps in the function template. Exploit the purpose statement and the examples. (Designer must: evaluate results with respect to expected outcomes)
6. Testing
   Articulate the examples as tests and ensure that the function passes all. Doing so discovers mistakes. Tests also supplement examples in that they help others read and understand the definition when the need arises???and it will arise for any serious program. (Designer must: revise the product in light of failed checks and tests)
