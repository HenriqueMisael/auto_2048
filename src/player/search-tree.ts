import { AutoPlayer } from './auto';
import { Game } from '../game/game';
import { BoardState } from '../game/boardState';

type Best = {
  utility: number;
  movement: number;
};
export class SearchTreePlayer extends AutoPlayer {
  constructor(game: Game) {
    super(game);
  }

  private get possibleMovements() {
    return this.game.possibleMovements
      .map((possible, i) => (possible === 1 ? i : -1))
      .filter((movement) => movement >= 0);
  }

  private move(movement: number): BoardState {
    switch (movement) {
      case 0:
        return this.game.boardState.left;
      case 1:
        return this.game.boardState.up;
      case 2:
        return this.game.boardState.right;
      case 3:
        return this.game.boardState.down;
    }
    return this.game.boardState;
  }

  protected get moveOption(): number {
    let best = { utility: Number.NEGATIVE_INFINITY, movement: -1 };

    this.possibleMovements.forEach((movement) => {
      const utility = this.move(movement).value;
      if (utility <= best.utility) return;
      best.utility = utility;
      best.movement = movement;
    });

    return best.movement;
  }
}
