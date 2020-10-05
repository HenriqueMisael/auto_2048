type CombinedBoardState = {
  boardState: BoardState;
  combinedScore: number;
};

type CellCord = { i: number; j: number };

export class BoardState {
  public static findEmptyCells(state: number[][]) {
    const emptyCells: CellCord[] = [];

    state.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value > 0) return;
        emptyCells.push({ i, j });
      });
    });

    return emptyCells;
  }

  public static fromSize(size: number) {
    const state: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row[j] = 0;
      }
      state[i] = row;
    }

    BoardState.insertRandomTile(state, BoardState.findEmptyCells(state));
    BoardState.insertRandomTile(state, BoardState.findEmptyCells(state));

    return new BoardState(state, BoardState.findEmptyCells(state));
  }

  public static insertRandomTile(state: number[][], emptyCells: CellCord[]) {
    if (emptyCells.length === 0) throw new Error('No empty cell to insert new tile');

    const randomCellCord = Math.floor(Math.random() * emptyCells.length);
    const { i, j } = emptyCells[randomCellCord];

    state[i][j] = Math.random() < 0.1 ? 2 : 1;

    return { state, inserted: randomCellCord };
  }

  private readonly state: number[][];
  public readonly size: number;
  public readonly emptyCells?: CellCord[];

  constructor(state: number[][], emptyCells?: CellCord[]) {
    this.state = state;
    this.size = state[0].length;
    this.emptyCells = emptyCells;

    this.forEachPiece((value) => {
      if (value == null) throw new Error('Undefined tile invalid!');
    });
  }

  public get value(): number {
    return this.state.reduce(
      (acc, row) => acc + row.reduce((acc, value) => acc + value, 0),
      0,
    );
  }

  public get pieceCount(): number {
    return this.state.reduce((acc, row) => acc + row.reduce((acc) => acc + 1, 0), 0);
  }

  public get copyState(): number[][] {
    return [...this.state.map((row) => [...row])];
  }

  private get reverse(): BoardState {
    const reversed: number[][] = [];

    this.state.forEach((row, i) => {
      const reversedRow: number[] = [];
      row.forEach((_, j) => {
        reversedRow.push(this.state[i][this.size - 1 - j]);
      });
      reversed[i] = reversedRow;
    });

    return new BoardState(reversed);
  }

  private get combine(): CombinedBoardState {
    let combinedScore = 0;
    const combined = this.copyState;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (combined[i][j] != 0 && combined[i][j] == combined[i][j + 1]) {
          combined[i][j] += 1;
          combined[i][j + 1] = 0;

          combinedScore += Math.pow(2, combined[i][j]);
        }
      }
    }
    return {
      boardState: new BoardState(combined),
      combinedScore,
    };
  }

  private get stack(): BoardState {
    const stacked = this.copyState;
    for (let x = 0; x < this.size; x++) {
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

  private get transpose(): BoardState {
    const transposed: number[][] = this.copyState;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        transposed[i][j] = this.state[j][i];
      }
    }

    return new BoardState(transposed);
  }

  get up(): CombinedBoardState {
    const { boardState, combinedScore } = this.transpose.stack.combine;
    return { boardState: boardState.stack.transpose, combinedScore };
  }

  get left(): CombinedBoardState {
    const { boardState, combinedScore } = this.stack.combine;
    return { boardState: boardState.stack, combinedScore };
  }

  get down(): CombinedBoardState {
    const { boardState, combinedScore } = this.transpose.reverse.stack.combine;
    return {
      boardState: boardState.stack.reverse.transpose,
      combinedScore,
    };
  }

  get right(): CombinedBoardState {
    const { boardState, combinedScore } = this.reverse.stack.combine;
    return {
      boardState: boardState.stack.reverse,
      combinedScore,
    };
  }

  get leftAllowed() {
    return !this.equals(this.left.boardState);
  }

  get upAllowed() {
    return !this.equals(this.up.boardState);
  }

  get rightAllowed() {
    return !this.equals(this.right.boardState);
  }

  get downAllowed() {
    return !this.equals(this.down.boardState);
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
        return { boardState: this, combinedScore: 0 };
    }
  }

  get insertTile(): BoardState {
    const emptyCells = this.emptyCells || BoardState.findEmptyCells(this.state);

    const { state, inserted } = BoardState.insertRandomTile(this.copyState, emptyCells);

    emptyCells.splice(inserted, 1);

    return new BoardState(state, emptyCells);
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

  forEachPiece(func: (value: number) => void) {
    this.state.forEach((row) => row.forEach(func));
  }

  get higherPiece() {
    let max = 0;
    this.forEachPiece((value) => {
      if (value > max) max = value;
    });
    return max;
  }
}
