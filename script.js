const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let fileInput = document.getElementById('upload');

let rotateAngle = 0;
let isDragging = false;
let startX, startY, endX, endY;
let isTextDragging = false;
let textX = 20, textY = 30;
let text = "";

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            img.src = ev.target.result;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
        };
        reader.readAsDataURL(file);
    }
});

function rotateImage() {
    rotateAngle = (rotateAngle + 90) % 360;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotateAngle * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
    drawText();
}

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    if (text && ctx.isPointInPath(textX, textY)) {
        isTextDragging = true;
    } else {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        endX = e.offsetX;
        endY = e.offsetY;
        drawImageWithSelection();
    } else if (isTextDragging) {
        textX = e.offsetX;
        textY = e.offsetY;
        redrawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        cropImage();
    }
    isDragging = false;
    isTextDragging = false;
});

function drawImageWithSelection() {
    redrawCanvas();
    ctx.strokeStyle = 'red';
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function cropImage() {
    const cropWidth = endX - startX;
    const cropHeight = endY - startY;
    const imageData = ctx.getImageData(startX, startY, cropWidth, cropHeight);
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.putImageData(imageData, 0, 0);
    redrawCanvas();
}

function resizeImage() {
    const newWidth = prompt("Enter new width:");
    const newHeight = prompt("Enter new height:");
    if (newWidth && newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
}

function addText() {
    text = prompt("Enter text:");
    textX = 20;
    textY = canvas.height - 20;
    redrawCanvas();
}

function drawText() {
    if (text) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, textX, textY);
    }
}

function applyFilter() {
    const filter = document.getElementById('filter').value;
    switch (filter) {
        case 'grayscale': ctx.filter = 'grayscale(1)'; break;
        case 'sepia': ctx.filter = 'sepia(1)'; break;
        case 'invert': ctx.filter = 'invert(1)'; break;
        case 'brightness': ctx.filter = 'brightness(1.5)'; break;
        case 'contrast': ctx.filter = 'contrast(2)'; break;
        case 'saturate': ctx.filter = 'saturate(2)'; break;
        case 'hue-rotate': ctx.filter = 'hue-rotate(90deg)'; break;
        case 'blur': ctx.filter = 'blur(5px)'; break;
        case 'opacity': ctx.filter = 'opacity(0.5)'; break;
        case 'shadow': ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; ctx.shadowBlur = 10; break;
        case 'red-tint': ctx.filter = 'sepia(1) saturate(5) hue-rotate(-30deg)'; break;
        case 'blue-tint': ctx.filter = 'sepia(1) saturate(5) hue-rotate(240deg)'; break;
        case 'green-tint': ctx.filter = 'sepia(1) saturate(5) hue-rotate(90deg)'; break;
        case 'pixelate': ctx.filter = 'blur(0.3px) contrast(1.5)'; break;
        case 'sharpen': ctx.filter = 'contrast(2) saturate(2)'; break;
        case 'vintage': ctx.filter = 'sepia(0.8)'; break;
        case 'vibrance': ctx.filter = 'saturate(1.5)'; break;
        case 'noise': ctx.filter = 'contrast(1.2) brightness(0.9)'; break;
        case 'emboss': ctx.filter = 'contrast(1.2)'; break;
        case 'edge-detect': ctx.filter = 'contrast(3) brightness(1.2)'; break;
        default: ctx.filter = 'none';
    }
    redrawCanvas();
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.filter = document.getElementById('filter').value !== 'none' ? `${document.getElementById('filter').value}(1)` : 'none';
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    drawText();
}

