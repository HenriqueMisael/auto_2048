import { AutoPlayer } from '../auto';
import { Game } from '../../game/game';
import { Chromosome } from './chromosome';

export class GeneticPlayer extends AutoPlayer {
  private chromosomes: Chromosome[];
  private age: number;

  static random(game: Game) {
    return new GeneticPlayer(game, [Chromosome.fromRandom(4)]);
  }

  static fixed(game: Game, weights: number[]) {
    return new GeneticPlayer(game, [Chromosome.fromFixed(weights)]);
  }

  static breed(game: Game, parent0: GeneticPlayer, parent1: GeneticPlayer) {
    const chromosomes = [];

    for (let i = 0; i < parent0.chromosomes.length; i++) {
      chromosomes.push(
        Chromosome.fromCrossover(parent0.chromosomes[i], parent1.chromosomes[i]),
      );
    }

    return new GeneticPlayer(game, chromosomes);
  }

  constructor(game: Game, chromosomes: Chromosome[]) {
    super(game);
    this.age = 1;
    this.chromosomes = chromosomes;
  }

  setGame(game: Game) {
    if (!this.game.ended) return;
    this.game = game;
  }

  protected get moveOption(): number {
    const input = this.game.possibleMovements;

    const output =
      this.chromosomes
        .map((chromosome) => chromosome.calculate(input))
        .reduce((acc, value) => acc + value) / this.chromosomes.length;

    return Math.ceil(output) - 1;
  }
}
