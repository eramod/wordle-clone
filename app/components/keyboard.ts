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
          alert('The word of the day is ${this.wordOfTheDay}.');
        } else if (
          this.isGuessInWordList &&
          this.currentGuessID < this.maxGuessID
        ) {
          // TODO: Color keyboard letters as well. A yellow letter can later be overwritten to be green.
          this.wordOfTheDay.split('').forEach((letter, index) => {
            let guessEl: HTMLElement | null = document.querySelector(
              `[data-guess-index="${this.currentGuessID}"][data-letter-index="${index}"]`
            );

            assert('Element must exist', guessEl);

            // Check for GREEN
            if (letter === this.currentGuess[index]) {
              guessEl.setAttribute('data-letter-disposition', 'exact');

              this.currentGuess.forEach((guessLetter) => {
                let el = document.querySelector(`[data-key="${guessLetter}"]`);

                if (guessLetter === letter) {
                  el?.setAttribute('data-letter-disposition', 'exact');
                }
              });
            } else {
              // Check for YELLOW
              this.currentGuess.forEach((guessLetter, guessIndex) => {
                let guessEl: HTMLElement | null = document.querySelector(
                  `[data-guess-index="${this.currentGuessID}"][data-letter-index="${guessIndex}"]`
                );
                assert('Guess letter element must exist', guessEl);
                let keyboardEl = document.querySelector(
                  `[data-key="${guessLetter}"]`
                );
                assert('Keyboard letter element must exist', keyboardEl);

                if (
                  letter === guessLetter &&
                  guessEl.getAttribute('data-letter-disposition') !== 'exact'
                ) {
                  guessEl.setAttribute('data-letter-disposition', 'included');
                }

                if (
                  letter === guessLetter &&
                  keyboardEl.getAttribute('data-letter-disposition') !== 'exact'
                ) {
                  keyboardEl.setAttribute(
                    'data-letter-disposition',
                    'included'
                  );
                }
              });
            }
          });

          // Default to GRAY
          this.currentGuess.forEach((letter, i) => {
            let guessEl = document.querySelector(
              `[data-guess-index="${this.currentGuessID}"][data-letter-index="${i}"]`
            );

            let keyboardEl = document.querySelector(`[data-key="${letter}"]`);
            assert('Element must exist', guessEl);

            if (guessEl.getAttribute('data-letter-disposition') === '') {
              guessEl.setAttribute('data-letter-disposition', 'not-included');
            }

            if (keyboardEl?.getAttribute('data-letter-disposition') === '') {
              keyboardEl.setAttribute(
                'data-letter-disposition',
                'not-included'
              );
            }
          });

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
