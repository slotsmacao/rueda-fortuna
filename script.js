// Segmentos de la rueda
const segments = [
  "CORTESIA",
  "REGALO PREMIUM",
  "SIGA PARTICIPANDO",
  "CORTESIA",
  "REGALO PREMIUM",
  "SIGA PARTICIPANDO",
  "CORTESÍA",
  "REGALO PREMIUM"
];

// Variables para dibujar y rotar la rueda
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultMessage = document.getElementById("resultMessage");

const totalSegments = segments.length;
const arcSize = (2 * Math.PI) / totalSegments;
let currentRotation = 0; // Rotación en radianes
let spinTimeout = null;
let spinAngle = 0; // Velocidad de giro
let spinAngleIncrement = 0; // Incremento que se aplicará cada frame
let isSpinning = false;

// Dibujar la rueda inicialmente
drawWheel();

spinButton.addEventListener("click", function() {
  if (isSpinning) return; // evitar múltiples clics mientras gira

  isSpinning = true;
  resultMessage.textContent = "";

  // Velocidad inicial de la ruleta (entre 10 y 15)
  spinAngle = Math.floor(Math.random() * 6) + 10;
  spinAngleIncrement = 0.2; // Desaceleración
  rotateWheel();
});

function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar segmentos
  for (let i = 0; i < totalSegments; i++) {
    // Inicio y fin del arco
    const startAngle = currentRotation + i * arcSize;
    const endAngle = startAngle + arcSize;

    // Colores alternos (puedes personalizarlos)
    ctx.fillStyle = getSegmentColor(i);

    // Dibujar sector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();

    // Dibujar texto
    ctx.save();
    ctx.fillStyle = "#fff"; // color del texto
    ctx.font = "12px Arial";
    ctx.translate(
      centerX + Math.cos(startAngle + arcSize / 2) * (radius * 0.55),
      centerY + Math.sin(startAngle + arcSize / 2) * (radius * 0.55)
    );
    ctx.rotate(startAngle + arcSize / 2 + Math.PI / 2);
    ctx.fillText(segments[i], -ctx.measureText(segments[i]).width / 2, 0);
    ctx.restore();
  }

  // Opcional: dibujar un círculo en el centro
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
}

function rotateWheel() {
  // Aplicar velocidad
  currentRotation += (spinAngle * Math.PI) / 180;
  drawWheel();

  // Desacelerar
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

  // Determinar índice ganador
  const degrees = (currentRotation * 180) / Math.PI; // rotación en grados
  const normalizedDegrees = degrees % 360; // 0-359
  const segmentIndex = Math.floor(
    totalSegments - (normalizedDegrees / 360) * totalSegments
  ) % totalSegments;

  const selectedSegment = segments[segmentIndex];
  resultMessage.textContent = `¡Felicidades! Obtuviste: ${selectedSegment}`;
}

// Función para obtener un color distinto por segmento
function getSegmentColor(index) {
  // Ejemplo de colores alternos
  const colors = ["#d35400", "#c0392b", "#16a085", "#2980b9", "#8e44ad"];
  return colors[index % colors.length];
}
