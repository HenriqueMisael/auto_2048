export class Chromosome {
  private readonly weights: number[];

  static fromRandom(size: number) {
    const weights = [];
    while (size--) {
      weights.push(Math.random());
    }
    return new Chromosome(weights);
  }

  static fromCrossover(c0: Chromosome, c1: Chromosome) {
    const middle = Math.ceil(c0.size / 2);

    const weights = c0.weights.slice(0, middle).concat(c1.weights.slice(middle));

    return new Chromosome(weights);
  }

  static fromFixed(weights: number[]) {
    return new Chromosome(weights);
  }

  constructor(weights: number[]) {
    this.weights = weights;
  }

  get size() {
    return this.weights.length;
  }

  calculate(input: number[]) {
    return input.reduce((sum, value, i) => sum + value * this.weights[i], 0);
  }
}
