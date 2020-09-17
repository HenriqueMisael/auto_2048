import p5 from 'p5';

import { Board } from './board';
import { Piece } from './piece';

export class Game {
  private board: Board;
  private p: p5;

  constructor(p: p5) {
    this.p = p;
    this.board = new Board(p);
  }

  static get height() {
    return Board.border * 5 + Piece.size * 4;
  }

  static get width() {
    return Board.border * 5 + Piece.size * 4;
  }

  update() {
    this.board.update();
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

    if (this.board.madeMove) {
      this.board.insertRandom();
    }
  }
}
