import { randomInt } from '../sketch';

import { AutoPlayer } from './auto';

export class RandomPlayer extends AutoPlayer {
  protected get moveOption() {
    return randomInt(0, 3);
  }
}
