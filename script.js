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

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

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

// Eraser function
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

// Function to create Canvas (append the canvasx to the body of the page)
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50; // Taking in consideration the 50px of the tool bar at the top.
  
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  body.appendChild(canvas);
  switchToBrush();
}

// Clear the Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];

  // Update active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// Function to draw what is cirrently stored in DrawnArray
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

// FUnction to store Drawn Lines in DrawnArray for soring Data
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  console.log(line);
  drawnArray.push(line);
}

// Get the mouse position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down listener
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move listener
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

// // Save to Local Storage
// saveStorageBtn.addEventListener('click', () => {

//   // Active Tool
//   activeToolEl.textContent = 'Canvas Saved';
//   setTimeout(switchToBrush, 1500);
// });

// // Load from Local Storage
// loadStorageBtn.addEventListener('click', () => {
//   if (localStorage.) {
//     drawnArray = JSON(localStorage.);

//   // Active Tool
//     activeToolEl.textContent = 'Canvas Loaded';
//     setTimeout(switchToBrush, 1500);
//   } 

// });

// // Clear Local Storage
// clearStorageBtn.addEventListener('click', () => {

//   // Active Tool
//   activeToolEl.textContent = 'Local Storage Cleared';
//   setTimeout(switchToBrush, 1500);
// });

// // Download Image
// downloadBtn.addEventListener('click', () => {

//   // Active Tool
//   activeToolEl.textContent = 'Image File Saved';
//   setTimeout(switchToBrush, 1500);
// });

// Event Listener
brushIcon.addEventListener('click', switchToBrush);

// Create the Canvas On Load
createCanvas();
