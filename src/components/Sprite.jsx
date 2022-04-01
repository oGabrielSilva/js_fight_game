import { gravity } from '../constants';

export default class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw(c) {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update(c, canvas) {
    this.draw(c);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.current.height
    )
      this.velocity.y = 0;
    else this.velocity.y += gravity;
  }
}
