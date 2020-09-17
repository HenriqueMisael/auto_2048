import { randomInt } from '../sketch';

import { Player } from './player';

export class RandomPlayer extends Player {
  private static moveOptions = [37, 38, 39, 40];

  keyPressed(evt: { keyCode: number }) {}
  turnPassed() {
    this.game.move(RandomPlayer.moveOptions[randomInt(0, 3)]);
  }
}
