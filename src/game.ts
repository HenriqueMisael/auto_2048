import p5 from 'p5';

import { Board } from './board';

export class Game {
  private board: Board;
  private p: p5;

  constructor(p: p5) {
    this.p = p;
    this.board = new Board(p);
  }

  update() {
    this.board.update();
  }

  keyPressed(evt: { keyCode: number }) {
    switch (evt.keyCode) {
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
