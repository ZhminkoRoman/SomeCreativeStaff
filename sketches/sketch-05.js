const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const load = require('load-asset');

const settings = {
	dimensions: [ 1080, 1080 ]
};

const image = new Image();
image.src = 'https://i.postimg.cc/X7rnwfHw/IMG-20221022-191904-897.jpg';
image.crossOrigin = "Anonymous";

let effect;

// const inputSlider = document.getElementById('resolution');
// const inputLabel = document.getElementById('resolutionLabel');
// inputSlider.addEventListener('change', handleSlider);

// const handleSlider = () => {
// 	if (inputSlider.value === 1) {
// 		inputLabel.innerHTML = 'Original Image'
// 	}
// }

class Cell {
	constructor(x, y, symbol, color) {
		this.x = x;
		this.y = y;
		this.symbol = symbol;
		this.color = color;
	}
	draw(ctx){
		ctx.fillStyle = this.color;
		// if (this.symbol === 'W' || this.symbol === 'X' || this.symbol === 'O' || this.symbol === '#') {
		// 	ctx.save();
		// 	ctx.strokeStyle = 'white';
		// 	ctx.translate(this.x, this.y);
		// 	ctx.rotate(random.range(1, 180) * Math.PI / 180);
		// 	ctx.translate(-this.x, -this.y);
		// 	ctx.lineWidth = random.range(2, 5);
		// 	ctx.strokeRect(this.x, this.y, random.range(10, 20), random.range(10, 20));
		// 	ctx.restore();
		// } else {
		// 	ctx.save();
		// 	ctx.translate(this.x, this.y);
		// 	ctx.rotate(random.range(1, 180) * Math.PI / 180);
		// 	ctx.translate(-this.x, -this.y);
		// 	ctx.font = `${random.range(10, 40)}px Hack`;
		// 	ctx.fillText(this.symbol, this.x, this.y);
		// 	ctx.restore();
		// }
		ctx.save();
		// ctx.translate(this.x, this.y);
		// ctx.rotate(random.range(1, 180) * Math.PI / 180);
		// ctx.translate(-this.x, -this.y);
		ctx.font = `40px Hack`;
		ctx.fillText(this.symbol, this.x, this.y);
		ctx.restore();
	}
}

class AsciiEffect {
	#imageCellArray = [];
	#pixels = [];
	#ctx;
	#width;
	#height;

	constructor(ctx, width, height) {
		this.#ctx = ctx;
		this.#width = width;
		this.#height = height;
		this.#ctx.drawImage(image, 0, 0, this.#width, this.#height);
		this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
	}
	
	convertToSymbol(g) {	
		if (g < 20) return '.';	
		if (g < 40) return '+';
		if (g < 60) return '*';
		if (g < 80) return '/';
		if (g < 100) return '$';
		if (g < 120) return '±';
		if (g < 140) return '?';
		if (g < 160) return '%';
		if (g < 180) return '&';
		if (g < 200) return '#';
		if (g < 220) return 'O';
		if (g < 240) return 'X';
		if (g => 240) return 'W';
		return '';
	}
	scanImage(cellSize) {
		this.#imageCellArray = [];
		for (let y = 0; y < this.#pixels.height; y += cellSize) {
			for (let x = 0; x < this.#pixels.width; x += cellSize) {
					const posX = x * 4;
					const posY = y * 4;
					const pos = (posY * this.#pixels.width) + posX;

					if (this.#pixels.data[pos + 3] > 128)	{
						const red = this.#pixels.data[pos];
						const green = this.#pixels.data[pos + 1];
						const blue = this.#pixels.data[pos + 2];
						const total = red + green + blue;
						const averageColorValue = total / 3;
						const color = `rgb(${red}, ${green}, ${blue})`;
						const symbol = this.convertToSymbol(averageColorValue);
						if (total > 50) {
							this.#imageCellArray.push(new Cell(x, y, symbol, color));
						}
					}
			}
		}
	}
	drawAscii() {
		this.#ctx.clearRect(0, 0, this.#width, this.#height);
		this.#ctx.fillStyle = 'black';
		this.#ctx.fillRect(0, 0, this.#width, this.#height);
		for (let i = 0; i < this.#imageCellArray.length; i++) {
			this.#imageCellArray[i].draw(this.#ctx);
		}
	}
	draw(cellSize) {
		this.scanImage(cellSize);
		this.drawAscii();
	}
}

const sketch = ({ context, width, height, update }) => {
	update({
    dimensions: [ image.width * 4, image.height * 4 ]
  });

	return ({ context, width, height }) => {
		effect = new AsciiEffect(context, width, height);
		effect.draw(20);
	};
};

image.onload = () => {
	canvasSketch(sketch, settings);
};
