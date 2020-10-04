import { GeneticPlayer } from './player/genetic/genetic';
import { Chromosome } from './player/genetic/chromosome';
import { Game } from './game/game';

const POP_MAX = 32;
const CROSSOVER_RATE = 0.3;
const MUTATION_RATE = 0.05;

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

for (let i = 1; i < 16; i++) {
  const raw = getBinaryArray(i);

  while (raw.length < 4) {
    raw.unshift(0);
  }

  fixedPlayerCreators.push(
    () => new GeneticPlayer(new Game(), [Chromosome.fromFixed([...raw])]),
  );
}

export function generateNewPopulation() {
  const players: GeneticPlayer[] = [];
  // fixedPlayerCreators.forEach((playerCreator) => {
  //   for (let i = 0; i < duplicatedPlayers; i++) {
  //     players.push(playerCreator());
  //   }
  // });
  for (let i = 0; i < POP_MAX; i++) {
    players.push(GeneticPlayer.random(new Game()));
  }
  return players;
}

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

function generateNewGeneration(players: GeneticPlayer[]) {
  players.sort((p0, p1) => p0.fitness - p1.fitness);

  const newPlayers: GeneticPlayer[] = [];
  const totalWeight = players.reduce((acc, player) => acc + player.fitness, 0);
  for (let i = 0; i < POP_MAX; i++) {
    let newPlayer: GeneticPlayer;

    const parent0 = pickParent(players, totalWeight);
    const game = new Game(parent0.game.boardState.size);

    if (Math.random() < CROSSOVER_RATE) {
      const parent1 = pickParent(players, totalWeight);
      newPlayer = GeneticPlayer.breed(game, parent0, parent1);
    } else {
      newPlayer = GeneticPlayer.replicate(game, parent0);
    }

    if (Math.random() < MUTATION_RATE) newPlayer.mutate();

    newPlayers.push(newPlayer);
  }
  return newPlayers;
}
