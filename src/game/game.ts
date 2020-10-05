import { BoardState } from './boardState';

export class Game {
  boardState: BoardState;
  public totalScore: number;
  public pastTime: number;
  private _ended: boolean = false;

  constructor(size: number) {
    // this.boardState = new BoardState([
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    // ]).insertTile.insertTile;
    this.boardState = BoardState.fromSize(size);
    this.pastTime = 0;
    this.totalScore = 0;
  }

  public static boardBorder = 4;
  public static pieceSize = 64;
  public static pieceMiddleOffset = Game.pieceSize / 2;

  move(movementCode: number) {
    let result;
    switch (movementCode) {
      case 38:
        result = this.boardState.up;
        break;
      case 37:
        result = this.boardState.left;
        break;
      case 40:
        result = this.boardState.down;
        break;
      case 39:
        result = this.boardState.right;
        break;
      default:
        result = null;
    }

    this.totalScore += result?.combinedScore ?? 0;

    if (this.boardState.higherPiece === 11) this.gameOver();

    if (!result || result.boardState.equals(this.boardState)) return;

    this.boardState = result.boardState.insertTile;
  }

  public get higherPiece() {
    return this.boardState.higherPiece;
  }

  public gameOver() {
    this._ended = true;
  }

  public get ended() {
    return this._ended;
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
