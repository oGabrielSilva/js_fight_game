import { gravity } from '../constants';
import Sprite from './Sprite';

export default class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale,
    framesMax,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: null, height: null },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.color = color;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.flipX = false;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update({ context, canvas, attack }) {
    this.draw(context);
    this.attack(attack);
    if (!this.dead) this.animateFrames();

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    this.hitBox.position.x = this.position.x + this.hitBox.offset.x;
    this.hitBox.position.y = this.position.y + this.hitBox.offset.y;

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.current.height - 96
    ) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  switchSprites(id) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    if (
      (this.image === this.sprites.attack1.image ||
        this.image === this.sprites.attack1Flip.image) &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (id) {
      case 'idle':
        if (
          this.image !== this.sprites.idle.image &&
          this.image !== this.sprites.idleFlip.image
        ) {
          this.image =
            (this.flipX && this.sprites.idleFlip.image) ||
            this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'run':
        if (
          this.image !== this.sprites.run.image &&
          this.image !== this.sprites.runFlip.image
        ) {
          this.image =
            this.flipX && this.velocity.x < 0
              ? this.sprites.runFlip.image
              : this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack1':
        if (
          this.image !== this.sprites.attack1.image &&
          this.image !== this.sprites.attack1Flip.image
        ) {
          this.image =
            (this.flipX && this.sprites.attack1Flip.image) ||
            this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;

      default:
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }

  attack(attack) {
    if (attack) this.switchSprites('attack1');
  }
}
