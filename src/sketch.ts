import p5 from 'p5';

import { Game } from './game/game';
import { Player } from './player/player';
import { GeneticPlayer } from './player/genetic/genetic';
import { Chromosome } from './player/genetic/chromosome';

export function randomInt(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}

const POP_MAX = 32;
const CROSSOVER_RATE = 0.3;
const MUTATION_RATE = 0.05;

const duplicatedPlayers = 2;
const fixedPlayerCreators: (() => GeneticPlayer)[] = [];

function getBinaryArray(x: number) {
  let bin = 0;
  let i = 1;
  let rem;

  while (x !== 0) {
    rem = x % 2;
    x = Math.floor(x / 2);
    bin = bin + rem * i;
    i = i * 10;
  }
  return ('' + bin).split('').map((s) => Number(s));
}

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
  let players: GeneticPlayer[] = [];
  let games: Game[] = [];
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

  function addGame() {
    const game = new Game(p, drawButton?.active ?? true);
    games.push(game);
    return game;
  }

  for (let i = 1; i < 16; i++) {
    const raw = getBinaryArray(i);

    while (raw.length < 4) {
      raw.unshift(0);
    }

    fixedPlayerCreators.push(
      () => new GeneticPlayer(addGame(), [Chromosome.fromFixed([...raw])]),
    );
  }

  p.setup = function () {
    p.frameRate(240);
    // fixedPlayerCreators.forEach((playerCreator) => {
    //   for (let i = 0; i < duplicatedPlayers; i++) {
    //     players.push(playerCreator());
    //   }
    // });
    for (let i = 0; i < POP_MAX; i++) {
      players.push(GeneticPlayer.random(addGame()));
    }

    distributeGames(games);

    const rows = gamesMatrix.length;
    const columns = gamesMatrix[0].length;
    const height = rows * Game.height;
    const width = (columns + 1) * Game.width;

    p.createCanvas(width, height);

    drawButton = p.createButton('Toggle drawing');
    drawButton.mouseClicked(() =>
      games.forEach((game) => {
        drawButton.active = game.toggleDrawing();
      }),
    );
  };

  p.windowResized = function () {
    distributeGames(games);
  };

  function pickParent(breeders: GeneticPlayer[], totalWeight: number) {
    let pickedWeight = Math.random() * totalWeight;

    let i = 0;
    for (; i < breeders.length; i++) {
      if (breeders[i].fitness > pickedWeight) {
        break;
      }
      pickedWeight -= breeders[i].fitness;
    }
    return breeders[i];
  }

  let gen = 0;
  let top: number[][] = [];

  p.draw = function () {
    const leaderBoardLeft = Game.width * gamesMatrix[0].length;
    p.fill('white');
    p.stroke('white');
    const leaderboardHeight = (top.length + 1) * 16;
    p.rect(leaderBoardLeft, 0, leaderBoardLeft + Game.width, leaderboardHeight);
    p.fill('black');
    p.text('Top', leaderBoardLeft, 16);
    drawButton.position(leaderBoardLeft + 8, leaderboardHeight + 16);

    top.forEach(([gen, fitness], index) => {
      p.text(`#${index}\t${gen} - ${fitness}`, leaderBoardLeft, (index + 2) * 16);
    });

    const ended = games.every((game) => game.ended);
    if (ended) {
      players.sort((p0, p1) => p0.fitness - p1.fitness);

      top = [...top, ...players.map((player) => [gen, player.fitness])];
      top.sort((a, b) => b[1] - a[1]);
      top = top.slice(0, 5);

      games = [];
      const newPlayers: GeneticPlayer[] = [];
      const totalWeight = players.reduce((acc, player) => acc + player.fitness, 0);
      for (let i = 0; i < POP_MAX; i++) {
        let newPlayer: GeneticPlayer;

        const parent0 = pickParent(players, totalWeight);
        const game = addGame();

        if (Math.random() < CROSSOVER_RATE) {
          const parent1 = pickParent(players, totalWeight);
          newPlayer = GeneticPlayer.breed(game, parent0, parent1);
        } else {
          newPlayer = GeneticPlayer.replicate(game, parent0);
        }

        if (Math.random() < MUTATION_RATE) newPlayer.mutate();

        newPlayers.push(newPlayer);
      }
      players = newPlayers;
      distributeGames(games);
      gen++;
      console.log(`New generation ${gen} with ${players.length} people`);
    }

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

    players.forEach((player) => player.turnPassed());
  };

  // @ts-ignore
  p.keyPressed = function (evt) {
    players.forEach((player: Player) => player.keyPressed(evt));
  };
};

new p5(sketch);
