// Segmentos de la rueda (con \n para forzar dos líneas en algunos)
const segments = [
  "CORTESÍA",
  "REGALO\nPREMIUM",
  "SIGA\nPARTICIPANDO",
  "CORTESÍA",
  "REGALO\nPREMIUM",
  "SIGA\nPARTICIPANDO",
  "CORTESÍA",
  "REGALO\nPREMIUM"
];

// Variables principales
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultMessage = document.getElementById("resultMessage");

const totalSegments = segments.length;
// Cada sector abarca este ángulo en radianes
const arcSize = (2 * Math.PI) / totalSegments;

let currentRotation = 0;       // Rotación acumulada en radianes
let spinTimeout = null;
let spinAngle = 0;            // Velocidad de giro en grados/frame
let spinAngleIncrement = 0;   // Desaceleración
let isSpinning = false;

// Dibujamos la rueda por primera vez
drawWheel();

// Botón de girar
spinButton.addEventListener("click", function() {
  if (isSpinning) return; // Evita múltiples clics mientras gira

  isSpinning = true;
  resultMessage.textContent = "";

  // Velocidad inicial aleatoria (entre 10 y 15 grados/frame)
  spinAngle = Math.floor(Math.random() * 6) + 10;
  spinAngleIncrement = 0.2; // Ajusta para más o menos desaceleración

  rotateWheel();
});

/**
 * Dibuja la rueda en el canvas
 */
function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar cada sector
  for (let i = 0; i < totalSegments; i++) {
    // Ángulo de inicio y fin para este sector
    const startAngle = currentRotation + i * arcSize;
    const endAngle = startAngle + arcSize;

    // Color de fondo del sector
    ctx.fillStyle = getSegmentColor(i);

    // Dibuja el sector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();

    // === DIBUJAR TEXTO RADIAL CON LÍNEAS MÚLTIPLES ===
    const textAngle = startAngle + arcSize / 2; // Ángulo central del sector
    const textRadius = radius * 0.8;            // Distancia desde el centro al texto

    ctx.save();
    // Trasladar origen al centro
    ctx.translate(centerX, centerY);
    // Rotar hasta el ángulo medio del sector
    ctx.rotate(textAngle);
    // Trasladar el texto cerca del borde
    ctx.translate(textRadius, 0);

    // Ajustes de texto
    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Girar el texto para que apunte hacia afuera
    ctx.rotate(-Math.PI / 2);

    // Dividir el texto en caso de que haya \n
    const lines = segments[i].split("\n");
    const lineHeight = 16; // separación vertical entre líneas

    // Calcular y dibujar cada línea centrada verticalmente
    const totalLines = lines.length;
    for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
      // Centrar verticalmente
      const yPos = (lineIndex - (totalLines - 1) / 2) * lineHeight;
      ctx.fillText(lines[lineIndex], 0, yPos);
    }

    ctx.restore();
  }

  // (Opcional) Círculo en el centro
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
}

/**
 * Inicia la animación de giro
 */
function rotateWheel() {
  // Convertir velocidad a radianes/frame
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

/**
 * Lógica para determinar el premio cuando se detiene
 */
function stopRotateWheel() {
  cancelAnimationFrame(spinTimeout);
  spinTimeout = null;
  isSpinning = false;

  // Ajuste para que "arriba" sea 0°, ya que en Canvas 0° está a la derecha
  const offset = 90; // Prueba 90, -90 o 270 según necesites
  const degrees = ((currentRotation * 180) / Math.PI + offset) % 360;
  const segmentSize = 360 / totalSegments;

  // Índice calculado en base a los grados
  let rawIndex = Math.floor(degrees / segmentSize);

  // Invertir si el orden está al revés
  // Prueba con o sin esta línea si no coincide el premio
  rawIndex = totalSegments - 1 - rawIndex;

  // Ajustar a rango válido
  const segmentIndex = ((rawIndex % totalSegments) + totalSegments) % totalSegments;

  // Mostrar premio
  const selectedSegment = segments[segmentIndex];
  resultMessage.textContent = `¡Felicidades! Obtuviste: ${selectedSegment}`;
}

/**
 * Asigna colores a los sectores de forma alternada
 */
function getSegmentColor(index) {
  const colors = ["#d35400", "#c0392b", "#16a085", "#2980b9", "#8e44ad"];
  return colors[index % colors.length];
}
