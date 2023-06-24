
function init() {
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  const canvas = document.getElementById('drawing');
  const context = canvas.getContext('2d');
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  const socket = io();

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  socket.on('draw_point', (data) => {
    const { x, y } = data.point;
    drawPoint(x * width, y * height);
  });

  socket.on('draw_line', (data) => {
    const { x1, y1, x2, y2 } = data.line;
    drawLine(x1 * width, y1 * height, x2 * width, y2 * height);
  });

  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePosition(e);
    drawPoint(lastX, lastY);
    socket.emit('draw_point', { point: { x: lastX / width, y: lastY / height } });
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const [x, y] = getMousePosition(e);

    drawPoint(x, y);
    drawLine(lastX, lastY, x, y);
    socket.emit('draw_line', {
      line: {
        x1: lastX / width,
        y1: lastY / height,
        x2: x / width,
        y2: y / height,
      },
    });

    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function drawPoint(x, y) {
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x, y, 2, 0, Math.PI * 2);
    context.fill();
  }

  function drawLine(x1, y1, x2, y2) {
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.type.startsWith('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return [x, y];
  }


  const $canvas = document.getElementById('drawing');
  const $btnDescargar = document.getElementById('btnDescargar');

  // ...

  $btnDescargar.addEventListener('click', () => {
    const enlace = document.createElement('a');
    enlace.download = 'firma.png';
    enlace.href = $canvas.toDataURL('image/png');
    enlace.click();
  });

  const clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', clearCanvas);


  function clearCanvas() {
    context.clearRect(0, 0, width, height);
    socket.emit('clear_canvas');
  }

  socket.on('clear_canvas', () => {
    context.clearRect(0, 0, width, height);
  });


}

document.addEventListener('DOMContentLoaded', init);