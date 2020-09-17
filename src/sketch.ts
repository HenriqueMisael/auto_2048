import p5 from 'p5';
import { Game } from './game';
import { Board } from './board';
import { Piece } from './piece';

var sketch = function (p: p5) {
  const games: Game[] = [];

  p.preload = () => {};

  p.setup = function () {
    const size = Board.border * 5 + Piece.size * 4;
    p.createCanvas(size, size);
    games.push(new Game(p));
    // p.frameRate(2);
  };

  p.windowResized = function () {};

  p.draw = function () {
    games.forEach((game) => game.update());
  };

  // @ts-ignore
  p.keyPressed = function (evt) {
    games.forEach((game) => game.keyPressed(evt));
  };
};

new p5(sketch);
