import p5 from 'p5';
import { Game } from './game/game';

const sketch = function (p: p5) {
  const games: Game[] = [];
  let gamesMatrix: Game[][] = [];

  function distributeGames(games: Game[]) {
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

  p.setup = function () {
    for (let i = 0; i < 16; i++) games.push(new Game(p));

    distributeGames(games);

    const rows = gamesMatrix.length;
    const columns = gamesMatrix[0].length;
    const height = rows * Game.height;
    const width = columns * Game.width;

    p.createCanvas(width, height);
  };

  p.windowResized = function () {
    distributeGames(games);
  };

  p.draw = function () {
    gamesMatrix.forEach((row, i) => {
      p.push();
      p.translate(0, Game.height * i);
      row.forEach((game, j) => {
        p.push();
        p.translate(Game.width * j, 0);

        if (game) game.update();

        p.pop();
      });
      p.pop();
    });
  };

  // @ts-ignore
  p.keyPressed = function (evt) {
    games.forEach((game) => game.keyPressed(evt));
  };
};

new p5(sketch);
