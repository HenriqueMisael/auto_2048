import p5 from 'p5';

import { Game } from './game/game';
import { Player } from './player/player';
import { SearchTreePlayer } from './player/search-tree';
import { BoardState } from './game/boardState';
import { KeyboardPlayer } from './player/human';

export function randomInt(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function getParameterByName(name: string, defaultValue: number): number {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return defaultValue;
  if (!results[2]) return defaultValue;
  return parseInt(decodeURIComponent(results[2].replace(/\+/g, ' ')));
}

const PLAYER_HUMAN = 1;
const PLAYER_SEARCH_TREE = 2;

const RUNS = getParameterByName('runs', 16);
const GAME_SIZE = getParameterByName('size', 4);
const AMOUNT = getParameterByName('amount', 1);
const PLAYER = getParameterByName('player', PLAYER_HUMAN);
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

    drawButton = p.createButton('Toggle drawing');
    drawButton.mouseClicked(() => (drawButton.active = !drawButton.active));
    drawButton.active = true;

    if (PLAYER === PLAYER_HUMAN) {
      players.push(new KeyboardPlayer(addGame(GAME_SIZE)));
    } else if (PLAYER === PLAYER_SEARCH_TREE) {
      for (let i = 0; i < AMOUNT; i++)
        players.push(new SearchTreePlayer(addGame(GAME_SIZE), RUNS));
    } else {
      throw new Error('Need to set a player');
    }
    distributeGames(games);

    const rows = gamesMatrix.length;
    const columns = gamesMatrix[0].length;
    const height = rows * GAME_HEIGHT;
    const width = columns * GAME_WIDTH;
    p.createCanvas(width, height);
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
    if (drawButton.active) {
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
      // } else {
      //   p.stroke('#333333');
      //   p.fill('#333333');
      //   p.rect(0, 0, GAME_WIDTH * gamesMatrix[0].length, GAME_HEIGHT * gamesMatrix.length);
    }
    players.forEach((player) => player.turnPassed());
    for (let i = 0; i < players.length; i++) {
      const { game } = players[i];
      game.pastTime += p.deltaTime;
      if (game.ended) {
        console.log(
          'Time: ',
          game.pastTime,
          'Score:',
          game.totalScore,
          'Peça:',
          game.higherPiece,
        );

        const newGame = new Game(game.boardState.size);
        games[i] = newGame;
        players[i] = new SearchTreePlayer(newGame, RUNS);
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
