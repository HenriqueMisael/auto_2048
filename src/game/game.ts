import p5 from 'p5';

import { Board } from './board';
import { Piece } from './piece';

export class Game {
  private board: Board;
  private p: p5;
  public totalScore: number | null = null;
  public scorePerPiece: number | null = null;
  public drawing: boolean;

  constructor(p: p5, drawing: boolean = true) {
    this.p = p;
    this.board = new Board(p);
    this.drawing = drawing;
  }

  static get height() {
    return Board.border * 5 + Piece.size * 4;
  }

  static get width() {
    return Board.border * 5 + Piece.size * 4;
  }

  get boardState() {
    return this.board.state;
  }

  update() {
    if (this.ended) return;
    this.board.update(this.drawing);
    const stuck = this.board.isStuck;
    if (stuck) this.gameOver();
  }

  move(movementCode: number) {
    switch (movementCode) {
      case this.p.UP_ARROW:
        this.board.moveTop();
        break;
      case this.p.LEFT_ARROW:
        this.board.moveLeft();
        break;
      case this.p.DOWN_ARROW:
        this.board.moveDown();
        break;
      case this.p.RIGHT_ARROW:
        this.board.moveRight();
        break;
    }
  }

  public gameOver() {
    this.totalScore = this.board.slots.reduce(
      (acc, row) => acc + row.reduce((acc, piece) => acc + (piece?.value ?? 0), 0),
      0,
    );
    this.scorePerPiece =
      this.totalScore /
      this.board.slots.reduce(
        (acc, row) => acc + row.filter((piece) => !!piece).length,
        0,
      );
  }

  public get ended() {
    return this.totalScore !== null;
  }

  toggleDrawing() {
    this.drawing = !this.drawing;
    return this.drawing;
  }

  get possibleMovements() {
    const isLeftAllowed = !this.board.unsuccessfulMoves.includes('Left');
    const isUpAllowed = !this.board.unsuccessfulMoves.includes('Top');
    const isRightAllowed = !this.board.unsuccessfulMoves.includes('Right');
    const isDownAllowed = !this.board.unsuccessfulMoves.includes('Down');

    return [
      isLeftAllowed ? 1 : 0,
      isUpAllowed ? 1 : 0,
      isRightAllowed ? 1 : 0,
      isDownAllowed ? 1 : 0,
    ];
  }
}
