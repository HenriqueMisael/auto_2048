import p5 from 'p5';

import { Game } from './game/game';
import { Player } from './player/player';
import { SearchTreePlayer } from './player/search-tree';
import { BoardState } from './game/boardState';
import { KeyboardPlayer } from './player/human';

export function randomInt(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}
const GAME_SIZE = 5;
const GAME_HEIGHT = Game.boardBorder * 5 + Game.pieceSize * GAME_SIZE;
const GAME_WIDTH = Game.boardBorder * 5 + Game.pieceSize * GAME_SIZE;

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

  function addGame(size: number) {
    const game = new Game(size);
    games.push(game);
    return game;
  }

  let gamesMatrix: Game[][] = [];

  function distributeGames(games: Game[]) {
    gamesMatrix = [];
    const gamesPerRow = Math.floor(p.windowWidth / GAME_WIDTH);

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

    const firstGame = addGame(GAME_SIZE);
    const player = new SearchTreePlayer(firstGame, 16);
    // const player = new KeyboardPlayer(firstGame);
    players.push(player);

    distributeGames(games);

    const rows = gamesMatrix.length;
    const columns = gamesMatrix[0].length;
    const height = rows * GAME_HEIGHT;
    const width = columns * GAME_WIDTH;
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
    // console.log('-------');
    board.copyState.forEach((row, i) => {
      // console.log(row);
      row.forEach((value, j) => {
        p.fill(value === 0 ? '#888888' : colors[Math.min(value, colors.length - 1)]);

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
      });
    });
  }

  p.draw = function () {
    gamesMatrix.forEach((row, i) => {
      p.push();
      p.translate(0, GAME_HEIGHT * i);
      row.forEach((game, j) => {
        if (!game || game.ended) return;

        p.push();
        p.translate(GAME_WIDTH * j, 0);

        drawBoard(game.boardState);

        p.pop();
      });
      p.pop();
    });
    players.forEach((player) => player.turnPassed());
    for (let i = 0; i < players.length; i++) {
      const { game } = players[i];
      if (game.ended) {
        // const pieces: number[] = [];
        // game.boardState.forEachPiece((value) => {
        //   pieces.push(Math.pow(2, value));
        // });
        // console.log(pieces.join(','));

        const newGame = new Game(game.boardState.size);
        games[i] = newGame;
        players[i] = new SearchTreePlayer(newGame, 25);
        distributeGames(games);
      }
    }
  };

  // @ts-ignore
  p.keyPressed = function (evt) {
    players.forEach((player: Player) => player.keyPressed(evt));
  };
};

new p5(sketch);

document.body.style.backgroundColor = '#333333';
