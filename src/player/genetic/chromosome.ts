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
    const pos = Math.ceil(Math.random() * c0.size);
    const length = Math.ceil(Math.random() * (c0.size - pos));

    const extract = c0.weights.slice(pos, pos + length);

    const head = [];
    for (let i = 0; i < pos; i++) {
      head.push(c1.weights[i]);
    }
    const tail = [];
    for (let i = pos + length; i < c1.weights.length; i++) {
      tail.push(c1.weights[i]);
    }

    return new Chromosome(head.concat(extract).concat(tail));
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

  mutate() {
    const i0 = Math.random() * this.size;
    const i1 = Math.random() * this.size;

    const temp = this.weights[i0];
    this.weights[i0] = this.weights[i1];
    this.weights[i1] = temp;
  }
}
