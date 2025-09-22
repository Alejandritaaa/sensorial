let osc;
let bolas = [];

let currentFreq = 200;
let currentAmp = 0;
let trailLength = 15; // largo de la estela

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255); 
  noStroke();
  noCursor();

  for (let i = 0; i < 40; i++) {
    bolas.push({
      radioBase: random(40, 250),
      velocidad: random(0.01, 0.05),
      angulo: random(TWO_PI),
      trail: [] // historial de posiciones
    });
  }

  osc = new p5.Oscillator('sine');
  osc.amp(0);
}

function draw() {
  background(20, 20, 40, 25);

  let rainbow = (frameCount * 0.5) % 255;
  let hue = map(currentFreq, 100, 1000, 0, 255);
  if (currentAmp <= 0) {
    hue = rainbow; 
  }

  let bolaSize = map(currentAmp, 0, 0.5, 15, 60);

  // dibujar bolas con estelas degradadas
  for (let i = 0; i < bolas.length; i++) {
    let b = bolas[i];
    b.angulo += b.velocidad;

    // radio ondulado
    let radioOndulado = b.radioBase + sin(frameCount * 0.05 + i) * (20 + currentAmp * 200);

    // nueva posición
    let x = mouseX + cos(b.angulo) * radioOndulado;
    let y = mouseY + sin(b.angulo) * radioOndulado;

    // agregar posición al trail
    b.trail.unshift(createVector(x, y));
    if (b.trail.length > trailLength) {
      b.trail.pop();
    }

    // dibujar la estela
    for (let j = 0; j < b.trail.length; j++) {
      let pos = b.trail[j];
      let alpha = map(j, 0, trailLength, 255, 0); // transparencia
      let size = map(j, 0, trailLength, bolaSize, 5); // tamaño decreciente
      let col = (hue + j * 10 + i * 5) % 255; // degradado de colores
      fill(col, 200, 255, alpha);
      ellipse(pos.x, pos.y, size);
    }
  }

  // ⭐ estrella como cursor dinámica
  push();
  let estrellaSize = map(currentAmp, 0, 0.5, 20, 70);
  let estrellaHue = (hue + 100) % 255;
  translate(mouseX, mouseY);
  rotate(frameCount * 0.02);
  drawStar(0, 0, estrellaSize * 0.4, estrellaSize, 5, estrellaHue);
  pop();
}

function drawStar(x, y, radius1, radius2, npoints, hueValue) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  push();
  translate(x, y);
  noStroke();
  fill(hueValue, 255, 255, 230);
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radius2;
    let sy = sin(a) * radius2;
    vertex(sx, sy);
    sx = cos(a + halfAngle) * radius1;
    sy = sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}

function mousePressed() {
  userStartAudio();
  if (!osc.started) {
    osc.start();
    osc.started = true;
  }

  currentFreq = map(mouseX, 0, width, 100, 1000);
  osc.freq(currentFreq);

  currentAmp = 0.3;
  osc.amp(currentAmp, 0.05);
}

function mouseReleased() {
  currentAmp = 0;
  osc.amp(0, 0.5);
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
