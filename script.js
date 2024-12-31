const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const message = document.getElementById('message');
const fireworksContainer = document.getElementById('fireworks');

let isJumping = false;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) {
    jump();
  }
});

function jump() {
  isJumping = true;
  let upInterval = setInterval(() => {
    let dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
    if (dinoBottom >= 150) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (dinoBottom <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        dino.style.bottom = `${dinoBottom - 10}px`;
        dinoBottom -= 10;
      }, 20);
    }
    dino.style.bottom = `${dinoBottom + 10}px`;
    dinoBottom += 10;
  }, 20);
}

let checkCollision = setInterval(() => {
  const dinoRect = dino.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    dinoRect.left < obstacleRect.right &&
    dinoRect.right > obstacleRect.left &&
    dinoRect.bottom > obstacleRect.top
  ) {
    clearInterval(checkCollision);
    obstacle.style.animation = 'none';
    obstacle.style.right = `${obstacle.offsetLeft}px`;
    alert('Game Over!');
    location.reload();
  }

  if (obstacle.offsetLeft < 50) {
    clearInterval(checkCollision);
    obstacle.style.animation = 'none';
    showMessage();
    startFireworks();
  }
}, 10);

function showMessage() {
  message.style.display = 'block';
}

function startFireworks() {
  console.log('Starting fireworks...'); // Log para depuração
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 5 + 3;
      this.color = color;
      this.speedX = Math.random() * 4 - 2;
      this.speedY = Math.random() * 4 - 2;
      this.alpha = 1;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.01;
    }
  }

  function createFireworks(x, y) {
    const colors = ['#ff4b4b', '#ffdb4b', '#4bffdb', '#ff4bcf', '#4b4bff'];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
  }

  function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      }
    });

    requestAnimationFrame(animateFireworks);
  }

  canvas.addEventListener('click', (e) => {
    createFireworks(e.clientX, e.clientY);
  });

  setInterval(() => {
    createFireworks(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
  }, 800);

  animateFireworks();
}