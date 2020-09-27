export class BoardState {
  private readonly state: number[][];

  constructor(state: number[][]) {
    this.state = state;
  }

  public get value() {
    return this.state.reduce(
      (acc, row) => acc + row.reduce((acc, value) => acc + value, 0),
      0,
    );
  }

  public get pieceCount() {
    return this.state.reduce((acc, row) => acc + row.reduce((acc) => acc + 1, 0), 0);
  }

  public get copyState(): number[][] {
    return [...this.state.map((row) => [...row])];
  }

  private get reverse() {
    const reversed: number[][] = this.copyState;

    this.state.forEach((row, i) => {
      const reversedRow: number[] = [];
      row.forEach((_, j) => {
        reversedRow.push(this.state[i][3 - j]);
      });
      reversed[i] = reversedRow;
    });

    return new BoardState(reversed);
  }

  private get combine() {
    const combined = this.copyState;
    for (let i = 0; i < combined.length; i++) {
      for (let j = 0; j < combined[i].length; j++) {
        if (combined[i][j] != 0 && combined[i][j] == combined[i][j + 1]) {
          combined[i][j] += 1;
          combined[i][j + 1] = 0;
        }
      }
    }
    return new BoardState(combined);
  }

  private get stack() {
    const stacked = this.copyState;
    for (let x = 0; x < 4; x++) {
      for (let i = 0; i < stacked.length; i++) {
        let emptyColumns: number[] = [];
        for (let j = 0; j < stacked[i].length; j++) {
          if (stacked[i][j] === 0) {
            emptyColumns.push(j);
          } else {
            const emptyColumn = emptyColumns.shift();
            if (emptyColumn !== undefined) {
              stacked[i][emptyColumn] = stacked[i][j];
              stacked[i][j] = 0;
              emptyColumns.push(j);
            }
          }
        }
      }
    }
    return new BoardState(stacked);
  }

  private get transpose() {
    const transposed: number[][] = this.copyState;
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < transposed[i].length; j++) {
        transposed[i][j] = this.state[j][i];
      }
    }

    return new BoardState(transposed);
  }

  get up(): BoardState {
    return this.transpose.stack.combine.stack.transpose;
  }

  get left(): BoardState {
    return this.stack.combine.stack;
  }

  get down(): BoardState {
    return this.transpose.reverse.stack.combine.stack.reverse.transpose;
  }

  get right(): BoardState {
    return this.reverse.stack.combine.stack.reverse;
  }

  get leftAllowed() {
    return !this.equals(this.left);
  }

  get upAllowed() {
    return !this.equals(this.up);
  }

  get rightAllowed() {
    return !this.equals(this.right);
  }

  get downAllowed() {
    return !this.equals(this.down);
  }

  get isStuck() {
    return (
      !this.leftAllowed && !this.upAllowed && !this.rightAllowed && !this.downAllowed
    );
  }

  get possibleMovements() {
    const movements = [];

    if (this.leftAllowed) movements.push(0);
    if (this.upAllowed) movements.push(1);
    if (this.rightAllowed) movements.push(2);
    if (this.downAllowed) movements.push(3);

    return movements;
  }

  move(movement: number) {
    switch (movement) {
      case 0:
        return this.left;
      case 1:
        return this.up;
      case 2:
        return this.right;
      case 3:
        return this.down;
      default:
        return this;
    }
  }

  get insertTile(): BoardState {
    const state = this.copyState;
    let i, j;

    do {
      i = Math.ceil(Math.random() * 4) % 4;
      j = Math.ceil(Math.random() * 4) % 4;
    } while (state[i][j] !== 0);

    state[i][j] = Math.random() < 0.1 ? 2 : 1;

    return new BoardState(state);
  }

  equals(boardState: BoardState) {
    const { state } = boardState;
    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i];
      for (let j = 0; j < row.length; j++) {
        let n = row[j];
        if (n !== state[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}
