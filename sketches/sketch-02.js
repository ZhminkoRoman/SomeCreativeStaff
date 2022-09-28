const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 60;
    const radius = width * 0.9;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(0, 0);
      context.rotate(-angle);
      context.scale(random.range(0.5, 5), random.range(0.1, 15.9));


      context.beginPath();
      context.rect(random.range(0, -w / 2), random.range(0, -h * 0.5), w / 6, h);
      context.fillStyle = `rgb(${4 * i}, ${17 * i}, -${4* i})`;
      context.fill();
      context.restore();

      context.save();
      context.translate(0, 0);
      context.rotate(-angle * 2.5);

      context.lineWidth = random.range(1, 10);

      context.beginPath();
      context.arc(-50, -50, radius * random.range(0.1, 3.3), slice * random.range(1, 24), slice * random.range(1, 62));
      context.strokeStyle = `rgb(${17 * i}, ${4 * i}, ${2 * i})`;
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
