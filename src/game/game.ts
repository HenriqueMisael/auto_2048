import { BoardState } from './boardState';

export class Game {
  boardState: BoardState;
  public totalScore: number | null = null;
  public scorePerPiece: number | null = null;
  public pieceCount: number | null = null;

  constructor() {
    this.boardState = new BoardState([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]).insertTile.insertTile;
  }

  public static boardBorder = 4;
  public static pieceSize = 64;
  public static pieceMiddleOffset = Game.pieceSize / 2;

  static get height() {
    return Game.boardBorder * 5 + Game.pieceSize * 4;
  }

  static get width() {
    return Game.boardBorder * 5 + Game.pieceSize * 4;
  }

  move(movementCode: number) {
    let newState;
    switch (movementCode) {
      case 38:
        newState = this.boardState.up.boardState;
        break;
      case 37:
        newState = this.boardState.left.boardState;
        break;
      case 40:
        newState = this.boardState.down.boardState;
        break;
      case 39:
        newState = this.boardState.right.boardState;
        break;
      default:
        newState = null;
    }

    if (!newState || newState.equals(this.boardState)) return;

    this.boardState = newState.insertTile;
  }

  public gameOver() {
    this.totalScore = this.boardState.value;
    this.pieceCount = this.boardState.pieceCount;
    this.scorePerPiece = this.totalScore / this.pieceCount;
  }

  public get ended() {
    return this.totalScore !== null;
  }

  get possibleMovements() {
    const isLeftAllowed = this.boardState.leftAllowed;
    const isUpAllowed = this.boardState.upAllowed;
    const isRightAllowed = this.boardState.rightAllowed;
    const isDownAllowed = this.boardState.downAllowed;

    return [
      isLeftAllowed ? 1 : 0,
      isUpAllowed ? 1 : 0,
      isRightAllowed ? 1 : 0,
      isDownAllowed ? 1 : 0,
    ];
  }
}
