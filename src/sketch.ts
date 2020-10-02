import p5 from 'p5';

import { Game } from './game/game';
import { Player } from './player/player';
import { SearchTreePlayer } from './player/search-tree';
import { BoardState } from './game/boardState';

export function randomInt(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}
const colors = [
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

export function mapRange(
  input: number,
  source: [number, number],
  target: [number, number],
) {
  const [xMin, xMax] = target;
  const [yMin, yMax] = source;

  const percent = (input - yMin) / (yMax - yMin);
  return percent * (xMax - xMin) + xMin;
}

const sketch = function (p: p5) {
  let players: Player[] = [];
  let games: Game[] = [];

  function addGame() {
    const game = new Game();
    games.push(game);
    return game;
  }

  let gamesMatrix: Game[][] = [];

  function distributeGames(games: Game[]) {
    gamesMatrix = [];
    const gamesPerRow = Math.floor(p.windowWidth / Game.width);

    let i = 0;
    for (let k = 0; k < games.length; ) {
      const row = [];
      for (let j = 0; j < gamesPerRow; j++) {
        row[j] = games[k++];
      }
      gamesMatrix[i++] = row;
    }
  }

  p.preload = () => {};

  let drawButton: any;

  p.setup = function () {
    p.frameRate(60);

    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));
    players.push(new SearchTreePlayer(addGame(), 25));

    distributeGames(games);

    const rows = gamesMatrix.length;
    const columns = gamesMatrix[0].length;
    const height = rows * Game.height;
    const width = columns * Game.width;
    p.createCanvas(width, height);

    drawButton = p.createButton('Toggle drawing');
    drawButton.mouseClicked(() => (drawButton.active = !drawButton.active));
    drawButton.active = true;
  };

  p.windowResized = function () {
    distributeGames(games);
  };

  function drawBoard(board: BoardState) {
    p.strokeWeight(0);
    p.translate(Game.boardBorder, Game.boardBorder);
    board.copyState.forEach((row, i) =>
      row.forEach((value, j) => {
        p.fill(value === 0 ? '#888888' : colors[value]);

        const top = i * (Game.pieceSize + Game.boardBorder);
        const left = j * (Game.pieceSize + Game.boardBorder);

        p.square(left, top, Game.pieceSize);

        if (value === 0) return;
        p.fill('white');
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(
          Math.pow(2, value),
          left + Game.pieceMiddleOffset,
          top + Game.pieceMiddleOffset,
        );
      }),
    );
  }

  p.draw = function () {
    for (let i = 0; i < players.length; i++) {
      const { game } = players[i];
      if (game.ended) {
        const pieces: number[] = [];
        game.boardState.forEachPiece((value) => {
          pieces.push(Math.pow(2, value));
        });
        console.log(pieces.join(','));
        const newGame = addGame();
        games[i] = newGame;
        players[i] = new SearchTreePlayer(newGame, 25);
      }
    }
    gamesMatrix.forEach((row, i) => {
      p.push();
      p.translate(0, Game.height * i);
      row.forEach((game, j) => {
        if (!game || game.ended) return;

        p.push();
        p.translate(Game.width * j, 0);

        drawBoard(game.boardState);

        p.pop();
      });
      p.pop();
    });
    players.forEach((player) => player.turnPassed());
  };

  // @ts-ignore
  p.keyPressed = function (evt) {
    players.forEach((player: Player) => player.keyPressed(evt));
  };
};

new p5(sketch);

document.body.style.backgroundColor = '#333333';
