let sonido; 
let circulitos = [];
let colaEstrella = [];  

let frecActual = 200;
let volActual = 0;
let largoColaBolas = 15; 
let largoColaEstrella = 30; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255); 
  noStroke();
  noCursor();

  // genero varias bolitas que giran
  for (let i = 0; i < 40; i++) {
    circulitos.push({
      radio: random(40, 250),
      vel: random(0.01, 0.05),
      ang: random(TWO_PI),
      cola: []
    });
  }

  sonido = new p5.Oscillator('sine');
  sonido.amp(0);
}

function draw() {
  background(20, 20, 40, 25);

  let arcoiris = (frameCount * 0.5) % 255;
  let tono = map(frecActual, 100, 1000, 0, 255);
  if (volActual <= 0) {
    tono = arcoiris; 
  }

  let tamBola = map(volActual, 0, 0.5, 15, 60);

  // dibuja las bolitas con colita
  for (let i = 0; i < circulitos.length; i++) {
    let c = circulitos[i];
    c.ang += c.vel;

    let radioOndita = c.radio + sin(frameCount * 0.05 + i) * (20 + volActual * 200);

    let x = mouseX + cos(c.ang) * radioOndita;
    let y = mouseY + sin(c.ang) * radioOndita;

    c.cola.unshift(createVector(x, y));
    if (c.cola.length > largoColaBolas) {
      c.cola.pop();
    }

    for (let j = 0; j < c.cola.length; j++) {
      let pos = c.cola[j];
      let alfa = map(j, 0, largoColaBolas, 255, 0);
      let tam = map(j, 0, largoColaBolas, tamBola, 5);
      let col = (tono + j * 10 + i * 5) % 255;
      fill(col, 200, 255, alfa);
      ellipse(pos.x, pos.y, tam);
    }
  }

  // la estrellita que sigue al mouse ✨
  let tamEstrella = map(volActual, 0, 0.5, 20, 70);
  let tonoEstrella = (tono + 100) % 255;

  colaEstrella.unshift({ 
    x: mouseX, 
    y: mouseY, 
    size: tamEstrella, 
    hue: tonoEstrella 
  });
  if (colaEstrella.length > largoColaEstrella) {
    colaEstrella.pop();
  }

  // dibuja la colita de la estrella
  for (let i = 0; i < colaEstrella.length; i++) {
    let pos = colaEstrella[i];
    let alfa = map(i, 0, largoColaEstrella, 200, 0);
    let tam = map(i, 0, largoColaEstrella, pos.size, 5);
    fill((pos.hue + i * 3) % 255, 255, 255, alfa);
    dibujarEstrella(pos.x, pos.y, tam * 0.4, tam, 5);
  }
}

// función para dibujar estrellas
function dibujarEstrella(x, y, radio1, radio2, puntas) {
  let ang = TWO_PI / puntas;
  let medioAng = ang / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += ang) {
    let sx = x + cos(a) * radio2;
    let sy = y + sin(a) * radio2;
    vertex(sx, sy);
    sx = x + cos(a + medioAng) * radio1;
    sy = y + sin(a + medioAng) * radio1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  userStartAudio();
  if (!sonido.started) {
    sonido.start();
    sonido.started = true;
  }
  frecActual = map(mouseX, 0, width, 100, 1000);
  sonido.freq(frecActual);

  volActual = 0.3;
  sonido.amp(volActual, 0.05);
}

function mouseReleased() {
  volActual = 0;
  sonido.amp(0, 0.5);
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
