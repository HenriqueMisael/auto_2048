import { AutoPlayer } from './auto';
import { Game } from '../game/game';
import { BoardState } from '../game/boardState';

export class SearchTreePlayer extends AutoPlayer {
  private static moveAndInsertTile(inputBoard: BoardState, move: number) {
    const { combinedScore, boardState } = inputBoard.move(move);
    return {
      boardState: boardState.insertTile,
      score: combinedScore,
    };
  }

  private static randomRun(inputBoard: BoardState, move: number) {
    let { boardState, score } = SearchTreePlayer.moveAndInsertTile(inputBoard, move);

    while (true) {
      const { possibleMovements } = boardState;
      const possibleMovementsCount = possibleMovements.length;
      if (possibleMovementsCount === 0) break;

      const randomMovement =
        possibleMovements[Math.floor(Math.random() * possibleMovementsCount)];
      const result = SearchTreePlayer.moveAndInsertTile(boardState, randomMovement);
      boardState = result.boardState;
      score += result.score;
    }
    return score;
  }

  constructor(game: Game) {
    super(game);
  }

  private get possibleMovements() {
    return this.game.boardState.possibleMovements;
  }

  protected get moveOption(): number {
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove = -1;

    for (const possibleMovement of this.possibleMovements) {
      const runs = 25;

      let total = 0.0;
      let min = 1000000;
      let max = 0;

      for (let i = 0; i < runs; i++) {
        const score = SearchTreePlayer.randomRun(this.game.boardState, possibleMovement);

        total += score;
        if (score < min) min = score;
        if (score > max) max = score;
      }

      const averageScore = total / runs;

      if (averageScore >= bestScore) {
        bestScore = averageScore;
        bestMove = possibleMovement;
      }
    }

    return bestMove;
  }
}
