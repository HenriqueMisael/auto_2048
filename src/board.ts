import { Piece } from './piece';
import p5 from 'p5';

export class Board {
  private slots: (Piece | null)[][];
  private p: p5;

  private _madeMove: boolean;

  constructor(p: p5) {
    this._madeMove = false;
    this.p = p;
    this.slots = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    this.insertRandom();
    this.insertRandom();
  }

  public get madeMove() {
    const madeMove = this._madeMove;

    this._madeMove = false;

    return madeMove;
  }

  public static readonly border = 4;

  update() {
    this.p.strokeWeight(0);
    this.p.translate(Board.border, Board.border);
    this.slots.forEach((row, i) =>
      row.forEach((piece, j) => {
        this.p.fill(piece ? piece.color : '#888888');

        const top = i * (Piece.size + Board.border);
        const left = j * (Piece.size + Board.border);

        this.p.square(left, top, Piece.size);

        if (!piece) return;
        this.p.fill('white');
        this.p.textSize(16);
        this.p.textStyle(this.p.BOLD);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(piece.value, left + Piece.middleOffset, top + Piece.middleOffset);

        piece.reset();
      }),
    );
  }

  private checkRowMovement(
    row: (Piece | null)[],
    j: number,
    emptySlots: number[],
    lastPiece: Piece | null,
  ) {
    if (!row[j]) {
      emptySlots.push(j);
      return lastPiece;
    }
    const piece = row[j] as Piece;

    if (lastPiece && lastPiece.mergeable(piece)) {
      lastPiece.merge(piece);
      row[j] = null;
      emptySlots.push(j);
      this._madeMove = true;
      return null;
    }

    const emptySlot = emptySlots.shift();
    if (emptySlot !== undefined) {
      row[j] = null;
      emptySlots.push(j);
      row[emptySlot] = piece;
      this._madeMove = true;
    }
    return piece;
  }

  public moveLeft() {
    this.slots.forEach((row, i) => {
      const emptySlots: number[] = [];
      let piece: Piece | null = null;

      for (let j = 0; j < row.length; j++) {
        piece = this.checkRowMovement(row, j, emptySlots, piece);
      }
    });
  }

  public moveRight() {
    this.slots.forEach((row, i) => {
      const emptySlots: number[] = [];
      let piece: Piece | null = null;

      for (let j = row.length - 1; j >= 0; j--) {
        piece = this.checkRowMovement(row, j, emptySlots, piece);
      }
    });
  }

  private checkColumnMovement(
    i: number,
    j: number,
    emptySlots: number[],
    lastPiece: Piece | null,
  ) {
    const piece = this.slots[i][j];

    if (piece) {
      if (lastPiece && lastPiece.mergeable(piece)) {
        lastPiece.merge(piece);
        this.slots[i][j] = null;
        emptySlots.push(i);
        this._madeMove = true;
        return null;
      }

      const emptySlot = emptySlots.shift();
      if (emptySlot !== undefined) {
        this.slots[emptySlot][j] = piece;
        this.slots[i][j] = null;
        emptySlots.push(i);
        this._madeMove = true;
      }
      return piece;
    } else {
      emptySlots.push(i);
      return lastPiece;
    }
  }

  public moveTop() {
    for (let j = 0; j < this.slots[0].length; j++) {
      const emptySlots: number[] = [];
      let piece: Piece | null = null;

      for (let i = 0; i < this.slots[j].length; i++) {
        piece = this.checkColumnMovement(i, j, emptySlots, piece);
      }
    }
  }

  public moveDown() {
    for (let j = 0; j < this.slots[0].length; j++) {
      const emptySlots: number[] = [];
      let piece: Piece | null = null;

      for (let i = this.slots.length - 1; i >= 0; i--) {
        piece = this.checkColumnMovement(i, j, emptySlots, piece);
      }
    }
  }

  insertRandom() {
    let i, j;

    do {
      i = Math.ceil(Math.random() * 4) % 4;
      j = Math.ceil(Math.random() * 4) % 4;
    } while (this.slots[i][j] !== null);

    this.slots[i][j] = new Piece(Math.random() < 0.1 ? 2 : 1);
  }
}
