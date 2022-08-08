import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { TrackedArray } from 'tracked-built-ins';
import { WORDLIST } from '../utils/word-list';

interface KeyboardArgs {} // FIXME: Remove? Not sure if I'm only going to use one component or multiple.

export default class Keyboard extends Component<KeyboardArgs> {
  @tracked currentGuessID = 0;
  maxGuessID = 5;

  @tracked currentLetterID = 0;
  maxLetterID = 4;

  @tracked guesses: TrackedArray<string[]> = new TrackedArray([
    new TrackedArray(['', '', '', '', '']),
    new TrackedArray(['', '', '', '', '']),
    new TrackedArray(['', '', '', '', '']),
    new TrackedArray(['', '', '', '', '']),
    new TrackedArray(['', '', '', '', '']),
    new TrackedArray(['', '', '', '', '']),
  ]);

  // TODO: Make this property update on a daily basis.
  // WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  wordOfTheDay: string = 'hello'; // Predictable for development purposes

  /**
   * The official Wordle list of possible words.
   */
  wordList: string[] = WORDLIST.split(/\r?\n/);

  /**
   * The layout of keys to display on the game's virtual keyboard, with each
   * nested array representing a row.
   */
  // TODO: Replace enter and backspace with icons.
  keyLayout: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];

  /**
   * The guess the user is currently entering.
   */
  get currentGuess(): string[] {
    let guess = this.guesses[this.currentGuessID];
    assert('Guess must exist', guess);
    return guess;
  }

  /**
   * Whether the `currentGuess` is in the official Wordle `wordList`.
   */
  get isGuessInWordList(): boolean {
    return this.wordList.includes(this.currentGuess.join(''));
  }

  /**
   * Adds the letter clicked on in the game's virtual keyboard to the
   * `currentGuess` property.
   *
   * @param key The letter or string in the game's virtual keyboard that was
   * clicked on.
   */
  @action
  onClick(key: string) {
    this.handleKeyInput(key);
  }

  /**
   * Handles the keyup event when a user types a letter on the keyboard.
   * Only handles keys that are in the `keyLayout`.
   *
   * @param e The keyup event, used to figure out which physical key was pressed.
   */
  @action
  onKeyup(e: KeyboardEvent) {
    // Only add allowed characters to the guess
    if (this.keyLayout.flat().includes(e.key)) {
      this.handleKeyInput(e.key);
    }
  }

  get wordOfTheDayLetterCounts(): Record<string, number> {
    let counts: Record<string, number> = {};

    for (let letter of this.wordOfTheDay) {
      counts[letter] = (counts[letter] || 0) + 1;
    }

    return counts;
  }

  get currentGuessLetterCounts(): Record<string, number> {
    let counts: Record<string, number> = {};

    for (let letter of this.currentGuess) {
      counts[letter] = (counts[letter] || 0) + 1;
    }

    return counts;
  }

  holder = [];

  get wordLetterCounts(): Record<string, Record<string, number>> {
    let counts: Record<string, Record<string, number>> = {};

    for (let word of this.wordList) {
      let wordCounts: Record<string, number> = {};

      for (let letter of word) {
        wordCounts[letter] = (wordCounts[letter] || 0) + 1;
      }

      counts[word] = wordCounts;
    }

    return counts;
  }

  /**
   * Handles common logic for responding to events, whether from the game's
   * virtual keyboard or the user's physical one.
   *
   * @param key A letter or string included in the `keyLayout`.
   */
  handleKeyInput(key: string): void {
    switch (key) {
      case 'Enter':
        if (this.currentGuess.join('') === this.wordOfTheDay) {
          // Make all letters in the guess GREEN
          this.currentGuess.forEach((letter, i) => {
            let el = document.querySelector(
              `[data-guess-index="${this.currentGuessID}"][data-letter-index="${i}"]`
            );

            assert('Element must exist', el);
            el.setAttribute('data-letter-disposition', 'exact');

            // Update guessed keyboard letter colors
            [...document.getElementsByClassName('keyboard-letter')]
              .find((el) => el.innerHTML.trim() === letter.toUpperCase())
              ?.setAttribute('data-letter-disposition', 'exact');
          });

          // TODO: Turn this into a toast message.
          alert('You win!');
        } else if (this.currentGuess.join('').length < 5) {
          // TODO: Turn this into a toast message.
          alert('Not enough letters');
        } else if (!this.isGuessInWordList) {
          // TODO: Turn this into a toast message.
          alert(`${this.currentGuess.join('')} not in word list`);
        } else if (this.currentGuessID === this.maxGuessID) {
          alert('You lose! Better luck next time.');
        } else if (
          this.isGuessInWordList &&
          this.currentGuessID < this.maxGuessID
        ) {
          // TODO: Color keyboard letters as well. A yellow letter can later be overwritten to be green.
          this.wordOfTheDay.split('').forEach((letter, index) => {
            let el: HTMLElement | null = document.querySelector(
              `[data-guess-index="${this.currentGuessID}"][data-letter-index="${index}"]`
            );
            assert('Element must exist', el);

            // Check for GREEN
            if (letter === this.currentGuess[index]) {
              // This can occur when the word of the day has multiple instances of a letter and the user's guess also has multiple instances of that letter.
              el.setAttribute('data-letter-disposition', 'exact');
            } else {
              // Check for YELLOW
              this.currentGuess.forEach((guessLetter, guessIndex) => {
                let el: HTMLElement | null = document.querySelector(
                  `[data-guess-index="${this.currentGuessID}"][data-letter-index="${guessIndex}"]`
                );
                assert('Element must exist', el);

                if (
                  letter === guessLetter &&
                  el.getAttribute('data-letter-disposition') !== 'exact'
                ) {
                  el.setAttribute('data-letter-disposition', 'included');
                }
              });
            }
          });

          // Default to GRAY
          this.currentGuess.forEach((letter, i) => {
            let el = document.querySelector(
              `[data-guess-index="${this.currentGuessID}"][data-letter-index="${i}"]`
            );

            assert('Element must exist', el);
            if (el.getAttribute('data-letter-disposition') === '') {
              el.setAttribute('data-letter-disposition', 'not-included');
            }
          });

          // function enumerate(xs) {
          //   return xs.map((x, i) => [i, x])
          // }

          // for (const [i, thing] of enumerate(['a', 'b', 'c'])) {

          // }

          /**
           * TODO: REMOVE THIS
           * Think about this: Does it matter which thing you loop through first? In this case, it does matter, and the fact that I had so many edge cases to deal with should be an indicator there's something wrong with the logic.
           *
           * T I M E S
           * Y B Y B Y
           *
           * Loop through the word of the day. Is the wordOfDay[0] === guess[0]? Yes = green, no = look for yellow case (start inner loop for each of the letters in the guess) and if the letter exists in the guess you make it yellow, EXCEPT if the letter is already colored you don't make it yellow.
           * T H U M B <- word of the day
           * I M A M S < - guess
           * B B B G B
           */

          // Here, we already know that the guess is valid and it already occupies the correct place in the guesses array, so all we have to do is update the `currentGuessID` and `currentLetterID` so the user can enter a new guess in the next slot.
          this.currentGuessID += 1;
          this.currentLetterID = 0;
        }

        break;

      case 'Backspace':
        this.currentGuess[this.currentLetterID - 1] = '';
        this.currentLetterID > 0 ? (this.currentLetterID -= 1) : 0;
        // this.currentLetterID = Math.max(this.currentLetterID - 1, 0)

        break;

      default:
        if (this.currentLetterID <= this.maxLetterID) {
          this.currentGuess[this.currentLetterID] += key;
          this.currentLetterID += 1;
        }
    }
  }
}
