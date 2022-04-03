export const gravity = 0.7;
export const velocityX = 5;
export const damage = 10;
export const timer = 60;

export const detectColision = ({ colisor, colisorTwo }) => {
  return (
    colisor.hitBox.position.x + colisor.hitBox.width >= colisorTwo.position.x &&
    colisor.hitBox.position.x <= colisorTwo.position.x + colisorTwo.width &&
    colisor.hitBox.position.y + colisor.hitBox.height >=
      colisorTwo.position.y &&
    colisor.hitBox.position.y <= colisorTwo.position.y + colisorTwo.height
  );
};
