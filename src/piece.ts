export class Piece {
  public level: number;

  public static readonly size = 64;
  private hasMerged: boolean;

  public static get middleOffset() {
    return Piece.size / 2;
  }

  constructor(level: number) {
    this.level = level;
    this.hasMerged = false;
  }

  public get value() {
    return Math.pow(2, this.level);
  }

  private static readonly colors = [
    '#dedede',
    '#decdcd',
    '#cdbcbc',
    '#bcabab',
    '#ab9a9a',
    '#9a8989',
    '#897878',
    '#786767',
    '#675656',
    '#564545',
    '#453434',
    '#342323',
    '#231212',
  ];

  public get color() {
    return Piece.colors[this.level];
  }

  public mergeable(other: Piece) {
    return !this.hasMerged && other.level === this.level;
  }

  public merge(nextTo: Piece) {
    if (!this.mergeable(nextTo)) return;
    this.level++;
    this.hasMerged = true;
  }

  public reset() {
    this.hasMerged = false;
  }
}
