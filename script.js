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
let spinAngleIncrement = 0; // Desaceleración
let isSpinning = false;

// Dibujar la rueda inicialmente
drawWheel();

spinButton.addEventListener("click", function() {
  if (isSpinning) return; // evitar múltiples clics mientras gira

  isSpinning = true;
  resultMessage.textContent = "";

  // Velocidad inicial aleatoria entre 10 y 15 grados por frame (ajusta según necesites)
  spinAngle = Math.floor(Math.random() * 6) + 10;
  spinAngleIncrement = 0.2; // Controla la desaceleración
  rotateWheel();
});

function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar cada segmento de la rueda
  for (let i = 0; i < totalSegments; i++) {
    const startAngle = currentRotation + i * arcSize;
    const endAngle = startAngle + arcSize;

    // Establecer colores para cada sector
    ctx.fillStyle = getSegmentColor(i);

    // Dibujar sector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();

    // Dibujar el texto dentro del sector
    ctx.save();
    ctx.fillStyle = "#fff"; // Color del texto
    ctx.font = "10px Arial"; // Tamaño de fuente reducido para ajustarlo

    // Ajustar la posición del texto (más cerca del centro para evitar que se salga)
    const textRadius = radius * 0.55;
    const textAngle = startAngle + arcSize / 2;
    const textX = centerX + Math.cos(textAngle) * textRadius;
    const textY = centerY + Math.sin(textAngle) * textRadius;

    ctx.translate(textX, textY);
    // Rotar el texto para que quede alineado verticalmente
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(segments[i], 0, 0);
    ctx.restore();
  }

  // Dibujar un círculo en el centro (opcional)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
}

function rotateWheel() {
  // Incrementa la rotación en función de la velocidad actual (convertida a radianes)
  currentRotation += (spinAngle * Math.PI) / 180;
  drawWheel();

  // Disminuye la velocidad de giro
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

  // Para que la flecha (en la parte superior) determine el premio correcto,
  // aplicamos un offset de 90° (porque 0° está a la derecha en el canvas)
  const offset = 90; // grados
  const degrees = ((currentRotation * 180) / Math.PI + offset) % 360;
  const segmentSize = 360 / totalSegments;

  // Calculamos el índice según el ángulo final
  let rawIndex = Math.floor(degrees / segmentSize);
  
  // Dependiendo del orden en que se dibujen los segmentos, invertimos el índice
  rawIndex = totalSegments - 1 - rawIndex;
  const segmentIndex = ((rawIndex % totalSegments) + totalSegments) % totalSegments;

  const selectedSegment = segments[segmentIndex];
  resultMessage.textContent = `¡Felicidades! Obtuviste: ${selectedSegment}`;
}

// Función para obtener un color diferente para cada segmento (alternando colores)
function getSegmentColor(index) {
  const colors = ["#d35400", "#c0392b", "#16a085", "#2980b9", "#8e44ad"];
  return colors[index % colors.length];
}
