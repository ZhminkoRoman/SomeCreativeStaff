const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

// const animate = () => {
//   console.log('domestika');
//   requestAnimationFrame(animate);
// };
// animate();

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#111111';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for(let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist <= agent.radius + other.radius) {
          if (agent.vel.y * other.vel.y > 0 && agent.vel.x * other.vel.x > 0) {
            if (Math.abs(agent.pos.x) > Math.abs(other.pos.x) && Math.abs(agent.pos.y) > Math.abs(other.pos.y)) {
              if (agent.vel.x < other.vel.x && agent.vel.y < other.vel.y) {
                other.vel.x *= -1;
                other.vel.y *= -1;
              } else if (agent.vel.x < other.vel.x && agent.vel.y > other.vel.y) {
                other.vel.x *= -1;
                other.vel.y *= -1;
              } else if (agent.vel.x > other.vel.x && agent.vel.y < other.vel.y) {
                other.vel.x *= -1;
                other.vel.y *= -1;
              }
            } else if (Math.abs(agent.pos.x) < Math.abs(other.pos.x) && Math.abs(agent.pos.y) < Math.abs(other.pos.y)) {
              if (agent.vel.x > other.vel.x && agent.vel.y > other.vel.y) {
                agent.vel.x *= -1;
                agent.vel.y *= -1;
              } else if (agent.vel.x < other.vel.x && agent.vel.y > other.vel.y) {
                agent.vel.x *= -1;
                agent.vel.y *= -1;
              } else if (agent.vel.x > other.vel.x && agent.vel.y < other.vel.y) {
                agent.vel.x *= -1;
                agent.vel.y *= -1;
              }
            } else if (Math.abs(agent.pos.x) < Math.abs(other.pos.x) && Math.abs(agent.pos.y) > Math.abs(other.pos.y)) {
              agent.vel.y *= -1;
              other.vel.y *= -1;
              agent.vel.x *= -1;
              other.vel.x *= -1;
            } else if (Math.abs(agent.pos.x) > Math.abs(other.pos.x) && Math.abs(agent.pos.y) < Math.abs(other.pos.y)) {
              agent.vel.y *= -1;
              other.vel.y *= -1;
              agent.vel.x *= -1;
              other.vel.x *= -1;
            }
          } else if (agent.vel.x * other.vel.x > 0) {
            agent.vel.y *= -1;
            other.vel.y *= -1;
          } else if (agent.vel.y * other.vel.y > 0) {
            agent.vel.x *= -1;
            other.vel.x *= -1;
          } else {
            agent.vel.y *= -1;
            other.vel.y *= -1;
            agent.vel.x *= -1;
            other.vel.x *= -1;
          }
        }

        if (dist => 0 && dist <= 200) {
          // agent.strokeStyle = `rgb(${255 - Math.round(dist)}, 49, 49)`;
          // other.strokeStyle = `rgb(${255 - Math.round(dist)}, 49, 49)`;
        }

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 6, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = `rgba(255, 255, 255, 0.5)`;
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
  
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
};

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
    this.strokeStyle = `rgba(255, 255, 255, 0.5)`;
  }

  wrap(width, height) {
    if (this.pos.x > width) {
      this.pos.x = 0; 
    }
    if (this.pos.x < 0) {
      this.pos.x = width; 
    }
    if (this.pos.y > height) {
      this.pos.y = 0; 
    }
    if (this.pos.y < 0) {
      this.pos.y = height; 
    }
  }

  bounce(width, height) {
    if (this.pos.x <= 0 + this.radius || this.pos.x >= width - this.radius) {
      this.vel.x *= -1;
    }

    if (this.pos.y <= 0 + this.radius || this.pos.y >= height - this.radius) {
      this.vel.y *= -1;
    }
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.strokeStyle = this.strokeStyle;
    context.stroke();

    context.restore();
  }
};
