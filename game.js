const characterImg = new Image();
characterImg.src = 'assets/character.png';

const boxImg = new Image();
boxImg.src = 'assets/box.png';

const heartImg = new Image();
heartImg.src = 'assets/heart.png';

// Eğer flower.png yoksa şimdilik heart.png'yi flower yerine de kullanabilirsin
const flowerImg = new Image();
flowerImg.src = 'assets/flower.png'; 

const meImg = new Image();
meImg.src = 'assets/me.png';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let character = { x: 50, y: 300, width: 64, height: 64, vy: 0, onGround: true };
let boxes = [
    { x: 300, y: 250, type: 'heart' },
    { x: 400, y: 250, type: 'flower' },
    { x: 500, y: 250, type: 'me' }
  ];
  
let animation = null;
let keys = {};

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function update() {
  if (keys['ArrowRight']) character.x += 2;
  if (keys['ArrowLeft']) character.x -= 2;

  // Jump
  if (keys['Space'] && character.onGround) {
    character.vy = -8;
    character.onGround = false;
  }

  character.y += character.vy;
  character.vy += 0.4; // gravity

  if (character.y >= 300) {
    character.y = 300;
    character.vy = 0;
    character.onGround = true;
  }

  // Check collision with boxes
  boxes.forEach((box, index) => {
    if (
      character.x < box.x + 40 &&
      character.x + 32 > box.x &&
      character.y < box.y + 40 &&
      character.y + 32 > box.y
    ) {
      if (character.vy < 0) { // kafayla çarpıyorsa
        animation = { x: box.x + 20, y: box.y, type: box.type, frame: 0 };
        boxes.splice(index, 1); // kutuyu kaldır
      }
    }
  });

  if (animation) {
    animation.y -= 1;
    animation.frame++;
    if (animation.frame > 60) animation = null;
  }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Character (görsel ile çiz)
    ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);
  
    // Boxes (görsel ile çiz)
    boxes.forEach(box => {
      ctx.drawImage(boxImg, box.x, box.y, 40, 40);
    });
  
    // Animation (kalp veya çiçek çıkışı)
    if (animation) {
        let img;
        if (animation.type === 'heart') img = heartImg;
        else if (animation.type === 'flower') img = flowerImg;
        else if (animation.type === 'me') img = meImg;
      
        let size = 32 + animation.frame * 0.5; // Her frame'de 0.5px büyüsün
        ctx.drawImage(img, animation.x - size/2, animation.y - size/2, size, size);
      }
      
      
  }
  

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
