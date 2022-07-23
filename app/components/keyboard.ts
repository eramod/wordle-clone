import { action, get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { TrackedArray } from 'tracked-built-ins';
import { WORDLIST } from '../utils/word-list';

interface KeyboardArgs {}

export default class Keyboard extends Component<KeyboardArgs> {
  /**
   * The user's current guess.
   */
  @tracked currentGuess = '';

  guesses: TrackedArray<string[]> = new TrackedArray([]);

  maxGuesses = 6;

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

  get guessCount() {
    return this.guesses.length;
  }

  get isGuessInWordList(): boolean {
    return this.wordList.includes(this.currentGuess);
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
        if (this.currentGuess.length < 5) {
          alert('Not enough letters');
        } else if (!this.isGuessInWordList) {
          alert(`${this.currentGuess} not in word list`);
          this.currentGuess = '';
        } else if (
          this.isGuessInWordList &&
          this.guesses.length < this.maxGuesses
        ) {
          // TODO: Check each letter against the word to see if it's in the word and whether it's in the correct position.
          this.guesses.push(this.currentGuess.split(''));
          // debugger;
          this.currentGuess = '';

          console.log('Guesses: ', this.guesses);
        }

        this.currentGuess = '';
        break;

      case 'Backspace':
        this.currentGuess = this.currentGuess.substring(
          0,
          this.currentGuess.length - 1
        );
        break;

      default:
        if (this.currentGuess.length < 5) {
          this.currentGuess += key;
        }
    }
  }
}
