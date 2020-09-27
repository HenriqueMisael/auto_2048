import { Player } from './player';

export abstract class AutoPlayer extends Player {
  private static moveOptions = [37, 38, 39, 40];

  keyPressed(evt: { keyCode: number }) {}

  turnPassed() {
    if (this.game.ended) return;
    const moveOption = this.moveOption;

    if (moveOption < 0) {
      this.game.gameOver();
    } else {
      this.game.move(AutoPlayer.moveOptions[moveOption]);
    }
  }

  get fitness() {
    const totalScore = this.game.totalScore ?? 0;
    const scorePerPiece = this.game.scorePerPiece ?? 0;
    return totalScore + scorePerPiece * (this.game.pieceCount ?? 0);
  }

  protected abstract get moveOption(): number;
}
