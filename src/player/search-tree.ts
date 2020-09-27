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

  private branchValue(state: BoardState, acc: number, deep: number): number {
    if (deep === 0) return acc;
    let utility = Number.NEGATIVE_INFINITY;
    let bestState = state;
    for (const possibleMovement of state.possibleMovements) {
      const newState = state.move(possibleMovement);
      if (newState.value <= utility) continue;
      utility = newState.value;
      bestState = newState;
    }

    return this.branchValue(bestState, utility, deep - 1);
  }

  protected get moveOption(): number {
    let best = { utility: Number.NEGATIVE_INFINITY, movement: -1 };

    this.possibleMovements.forEach((movement) => {
      const utility = this.branchValue(this.game.boardState.move(movement), 0, 64);
      if (utility <= best.utility) return;
      best.utility = utility;
      best.movement = movement;
    });

    return best.movement;
  }
}
