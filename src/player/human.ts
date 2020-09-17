import { Player } from './player';

export class KeyboardPlayer extends Player {
  keyPressed(evt: { keyCode: number }) {
    this.game.move(evt.keyCode);
  }
  turnPassed() {}
}
