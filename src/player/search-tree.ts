import { AutoPlayer } from './auto';
import { Game } from '../game/game';
import { BoardState } from '../game/boardState';

export class SearchTreePlayer extends AutoPlayer {
  private static moveAndInsertTile(inputBoard: BoardState, move: number) {
    const { combinedScore, boardState } = inputBoard.move(move);
    if (boardState.equals(inputBoard)) return null;
    return {
      boardState: boardState.insertTile,
      score: combinedScore,
    };
  }
  private static randomRun(inputBoard: BoardState, move: number) {
    let result = SearchTreePlayer.moveAndInsertTile(inputBoard, move);

    if (result === null) return 0;
    let { boardState, score } = result;
    let tries = 0;
    while (true) {
      if (tries === 4) break;
      const randomMovement = Math.floor(Math.random() * 4);
      const result = SearchTreePlayer.moveAndInsertTile(boardState, randomMovement);
      if (result === null) {
        tries++;
      } else {
        tries = 0;
        boardState = result.boardState;
        score += result.score;
      }
    }
    return score;
  }

  private readonly runs: number;

  constructor(game: Game, runs: number) {
    super(game);
    this.runs = runs;
  }

  protected get moveOption(): number {
    let bestScore = 0;
    let bestMove = -1;

    for (let movement = 0; movement < 4; movement++) {
      let total = 0.0;
      let min = 1000000;
      let max = 0;

      for (let i = 0; i < this.runs; i++) {
        const score = SearchTreePlayer.randomRun(this.game.boardState, movement);

        total += score;
        if (score < min) min = score;
        if (score > max) max = score;
      }

      const averageScore = total / this.runs;

      if (averageScore > bestScore) {
        bestScore = averageScore;
        bestMove = movement;
      }
    }

    return bestMove;
  }
}
