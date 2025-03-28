// Segmentos de la rueda
const segments = [
  "CORTESÍA",
  "REGALO PREMIUM",
  "SIGA PARTICIPANDO",
  "CORTESÍA",
  "REGALO PREMIUM",
  "SIGA PARTICIPANDO",
  "CORTESÍA",
  "REGALO PREMIUM"
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultMessage = document.getElementById("resultMessage");

const totalSegments = segments.length;
const arcSize = (2 * Math.PI) / totalSegments;
let currentRotation = 0; 
let spinTimeout = null;
let spinAngle = 0; 
let spinAngleIncrement = 0; 
let isSpinning = false;

// Dibujar la rueda inicialmente
drawWheel();

spinButton.addEventListener("click", function() {
  if (isSpinning) return;
  isSpinning = true;
  resultMessage.textContent = "";

  spinAngle = Math.floor(Math.random() * 6) + 10; // velocidad inicial aleatoria
  spinAngleIncrement = 0.2; // desaceleración
  rotateWheel();
});

function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar cada segmento
  for (let i = 0; i < totalSegments; i++) {
    // Ángulos de inicio y fin para el sector i
    const startAngle = currentRotation + i * arcSize;
    const endAngle = startAngle + arcSize;

    // Color de fondo del sector
    ctx.fillStyle = getSegmentColor(i);

    // Dibujar el sector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();

    // --------- DIBUJAR TEXTO RADIALMENTE AL BORDE ----------
    // Ángulo central del sector
    const textAngle = startAngle + arcSize / 2;
    // Radio donde se ubicará el texto (cerca del borde, un poco hacia adentro)
    const textRadius = radius * 0.8;

    ctx.save();
    // Trasladamos el origen de coordenadas al centro de la rueda
    ctx.translate(centerX, centerY);
    // Giramos el canvas hasta el ángulo central del sector
    ctx.rotate(textAngle);
    // Desplazamos el texto hacia la posición en el borde
    ctx.translate(textRadius, 0);

    // Configurar estilo de texto
    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Girar el texto para que quede radialmente hacia afuera.
    // -90° (en radianes, -Math.PI/2) hace que el texto apunte "hacia afuera".
    ctx.rotate(-Math.PI / 2);

    // Escribir el texto
    ctx.fillText(segments[i], 0, 0);

    ctx.restore();
    // -------------------------------------------------------
  }

  // (Opcional) Círculo en el centro
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
}

function rotateWheel() {
  currentRotation += (spinAngle * Math.PI) / 180;
  drawWheel();

  spinAngle -= spinAngleIncrement;
  if (spinAngle <= 0) {
    spinAngle = 0;
    stopRotateWheel();
  } else {
    spinTimeout = requestAnimationFrame(rotateWheel);
  }
}

function stopRotateWheel() {
  cancelAnimationFrame(spinTimeout);
  spinTimeout = null;
  isSpinning = false;

  // Ajustar para que "arriba" sea el premio
  const offset = 90; 
  const degrees = ((currentRotation * 180) / Math.PI + offset) % 360;
  const segmentSize = 360 / totalSegments;

  let rawIndex = Math.floor(degrees / segmentSize);
  // Invertir si fuera necesario (depende del orden)
  rawIndex = totalSegments - 1 - rawIndex;
  const segmentIndex = ((rawIndex % totalSegments) + totalSegments) % totalSegments;

  const selectedSegment = segments[segmentIndex];
  resultMessage.textContent = `¡Felicidades! Obtuviste: ${selectedSegment}`;
}

// Colores para los sectores
function getSegmentColor(index) {
  const colors = ["#d35400", "#c0392b", "#16a085", "#2980b9", "#8e44ad"];
  return colors[index % colors.length];
}
