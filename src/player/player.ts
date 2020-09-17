import { Game } from '../game/game';

export abstract class Player {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  abstract keyPressed(evt: { keyCode: number }): void;
  abstract turnPassed(): void;
}
