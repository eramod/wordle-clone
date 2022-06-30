import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

interface KeyboardArgs {}

export default class Keyboard extends Component<KeyboardArgs> {
  /**
   * The user's current guess.
   */
  @tracked currentGuess = '';

  /**
   * The layout of keys to display on the game's virtual keyboard, with each
   * nested array representing a row.
   */
  keyLayout: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];

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
        // TODO: Submit the guess once game play is implemented
        console.log(`The content is ${this.currentGuess}`);
        break;

      case 'Backspace':
        this.currentGuess = this.currentGuess.substring(
          0,
          this.currentGuess.length - 1
        );
        break;

      default:
        this.currentGuess += key;
    }
  }
}
