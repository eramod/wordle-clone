import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { TrackedArray } from 'tracked-built-ins';
import { WORDLIST } from '../utils/word-list';

interface KeyboardArgs {}

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
          // TODO: Check each letter against the word of the day to see if it's in the word and whether it's in the correct position.
          // Here, we already know that the guess is valid and it already occupies the correct place in the guesses array, so all we have to do is update the `currentGuessID` and `currentLetterID` so the user can enter a new guess in the next slot.
          this.currentGuessID += 1;
          this.currentLetterID = 0;
        }

        break;

      case 'Backspace':
        this.currentGuess[this.currentLetterID - 1] = '';
        this.currentLetterID -= 1;

        break;

      default:
        if (this.currentLetterID <= this.maxLetterID) {
          this.currentGuess[this.currentLetterID] += key;
          this.currentLetterID += 1;
        }
    }
  }
}
