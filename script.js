const BRUSH_TIMEOUT = 1500;
const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

const canvas = document.createElement('canvas')
canvas.id= 'canvas';
const context = canvas.getContext('2d');


// Global Variables
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#487EB0';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`;
  }
  else {
    brushSize.textContent = brushSlider.value;
  }
}

// Function to switch back to the Brush as the active tool
function switchToBrush() {
  isEraser = false;

  // Set brush as the active tool
  activeToolEl.textContent = 'Brush';

  // Change colors of brushIcon and ereser icon to show which one is active
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';

  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

// Function to set the timeout for the message in Active tool
function brushTimeSetTimeout(milliSeconds) {
  setTimeout(switchToBrush, milliSeconds);
}

// Function to create Canvas (append the canvasx to the body of the page)
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50; // Taking in consideration the 50px of the tool bar at the top.
  
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  body.appendChild(canvas);
  switchToBrush();
}

// Function to draw what is currently stored in drawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Function to store Drawn Lines in DrawnArray for soring Data
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Function to get the mouse position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser =false;
  currentColor =`#${brushColorBtn.value}`;
});

// Setting the Background color
bucketColorBtn.addEventListener('change', () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();

  // Restore what it was there before the Canvas was re-recreated.
  restoreCanvas();
});

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Eraser 
eraser.addEventListener('click', () => {
  isEraser = true;

  // Set eraser as the active tool
  activeToolEl.textContent = 'Eraser';

  // Change colors of brushIcon and ereser icon to show which one is active
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  
  currentColor = bucketColor;
  currentSize = 50;
});

// Clear the Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];

  // Update active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  brushTimeSetTimeout(BRUSH_TIMEOUT);
});

// Mouse Down 
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move 
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } 
  else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  
  // Display message in Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  brushTimeSetTimeout(BRUSH_TIMEOUT);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    // Re-pain the data from the drawnArray
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();

    // Display message in Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    brushTimeSetTimeout(BRUSH_TIMEOUT);
  } 
  else {
    activeToolEl.textContent = 'No Canvas found';
    brushTimeSetTimeout(BRUSH_TIMEOUT);
  }

});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');

  // Display message in Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  brushTimeSetTimeout(BRUSH_TIMEOUT);
});

// Download image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'PaintyCraftart.jpeg';

  // Display message in Active Tool
  activeToolEl.textContent = 'Image File Saved';
  brushTimeSetTimeout(BRUSH_TIMEOUT);
});

// Evennt listener for brushIcon
brushIcon.addEventListener('click', switchToBrush);

// Create the Canvas On Load
createCanvas();