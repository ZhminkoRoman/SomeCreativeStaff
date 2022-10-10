const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = 10;
    const rows = 10;
    const cells = cols * rows;

    const gridW = width * 0.8;
    const gridH = width * 0.8;

    const cellW = gridW / cols;
    const cellH = gridH / rows;

    const margX = (width - gridW) * 0.5;
    const margY = (height - gridH) * 0.5;

    for (let i = 0; i < cells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellW;
      const y = row * cellH;
      const w = cellW * 0.8;
      const h = cellH * 0.8;

      context.save();

      context.translate(x, y);
      context.translate(margX, margY);
      context.translate(cellW * 0.5, cellH * 0.5);

      context.lineWidth = 4;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
