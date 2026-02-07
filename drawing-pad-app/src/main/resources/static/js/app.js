class DrawingApp {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tempCanvas = document.getElementById('temp-canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.symmetryCanvas = document.getElementById('symmetry-canvas');
        this.symmetryCtx = this.symmetryCanvas.getContext('2d');
        
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.brushSize = 5;
        this.brushColor = '#000000';
        this.currentTool = 'brush';
        this.opacity = 1.0;
        this.symmetryMode = false;
        this.gridVisible = false;
        this.pressureSensitive = false;
        this.currentStamp = null;
        this.zoomLevel = 1;
        
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        this.initializeCanvas();
        this.initializeElements();
        this.initializeEventListeners();
        this.loadSavedDrawings();
        this.saveToHistory();
    }

    initializeCanvas() {
        this.setCanvasSize(800, 600);
        this.clearCanvas();
        
        // Set up drawing properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.tempCtx.lineCap = 'round';
        this.tempCtx.lineJoin = 'round';
    }

    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.tempCanvas.width = width;
        this.tempCanvas.height = height;
        this.symmetryCanvas.width = width;
        this.symmetryCanvas.height = height;
        
        // Update grid overlay
        const gridOverlay = document.getElementById('grid-overlay');
        if (gridOverlay) {
            gridOverlay.style.width = `${width}px`;
            gridOverlay.style.height = `${height}px`;
        }
    }

    initializeElements() {
        // Canvas size selector
        this.canvasSizeSelect = document.getElementById('canvas-size');
        this.customSizeInput = document.getElementById('custom-size-input');
        this.customWidthInput = document.getElementById('custom-width');
        this.customHeightInput = document.getElementById('custom-height');
        this.applyCustomSizeBtn = document.getElementById('apply-custom-size');
        
        // Zoom controls
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.zoomLevelDisplay = document.getElementById('zoom-level');
        
        // Tool controls
        this.brushSizeElements = document.querySelectorAll('.brush-size');
        this.colorOptions = document.querySelectorAll('.color-option');
        this.customColorInput = document.getElementById('custom-color');
        this.toolButtons = document.querySelectorAll('.tool-btn');
        this.opacitySlider = document.getElementById('opacity');
        this.opacityValue = document.getElementById('opacity-value');
        this.symmetryCheckbox = document.getElementById('symmetry-mode');
        this.gridCheckbox = document.getElementById('grid-lines');
        this.pressureCheckbox = document.getElementById('pressure-sensitive');
        this.stampOptions = document.querySelectorAll('.stamp-option');
        
        // Action buttons
        this.clearBtn = document.getElementById('clear-btn');
        this.undoBtn = document.getElementById('undo-btn');
        this.redoBtn = document.getElementById('redo-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.loadBtn = document.getElementById('load-btn');
        this.refreshGalleryBtn = document.getElementById('refresh-gallery');
        this.clearGalleryBtn = document.getElementById('clear-gallery');
        
        // Display elements
        this.mouseX = document.getElementById('mouse-x');
        this.mouseY = document.getElementById('mouse-y');
        this.currentBrushSize = document.getElementById('current-brush-size');
        this.currentColorDisplay = document.getElementById('current-color');
        this.currentToolDisplay = document.getElementById('current-tool');
        
        // Modal elements
        this.modal = document.getElementById('drawing-modal');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.closeModalBtn2 = document.getElementById('close-modal-btn');
        this.drawingsList = document.getElementById('drawings-list');
        this.galleryGrid = document.getElementById('gallery-grid');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    initializeEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrawing(touch);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.draw(touch);
        });
        
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        // Canvas size selection
        this.canvasSizeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.customSizeInput.classList.remove('hidden');
            } else {
                this.customSizeInput.classList.add('hidden');
                const [width, height] = e.target.value.split('x').map(Number);
                this.setCanvasSize(width, height);
                this.saveToHistory();
            }
        });
        
        this.applyCustomSizeBtn.addEventListener('click', () => {
            const width = parseInt(this.customWidthInput.value) || 800;
            const height = parseInt(this.customHeightInput.value) || 600;
            this.setCanvasSize(width, height);
            this.saveToHistory();
        });
        
        // Zoom controls
        this.zoomInBtn.addEventListener('click', () => this.zoom(0.1));
        this.zoomOutBtn.addEventListener('click', () => this.zoom(-0.1));
        
        // Brush size selection
        this.brushSizeElements.forEach(el => {
            el.addEventListener('click', () => {
                this.brushSizeElements.forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                this.brushSize = parseInt(el.dataset.size);
                this.currentBrushSize.textContent = this.brushSize;
            });
        });
        
        // Color selection
        this.colorOptions.forEach(el => {
            el.addEventListener('click', () => {
                this.colorOptions.forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                this.brushColor = el.dataset.color;
                this.currentColorDisplay.textContent = this.brushColor;
                this.currentColorDisplay.style.color = this.brushColor;
            });
        });
        
        this.customColorInput.addEventListener('input', (e) => {
            this.brushColor = e.target.value;
            this.currentColorDisplay.textContent = this.brushColor;
            this.currentColorDisplay.style.color = this.brushColor;
        });
        
        // Tool selection
        this.toolButtons.forEach(el => {
            el.addEventListener('click', () => {
                this.toolButtons.forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                this.currentTool = el.dataset.tool;
                this.currentToolDisplay.textContent = this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1);
                
                // Change cursor based on tool
                switch(this.currentTool) {
                    case 'brush':
                        this.canvas.style.cursor = 'crosshair';
                        break;
                    case 'eraser':
                        this.canvas.style.cursor = 'cell';
                        break;
                    case 'fill':
                        this.canvas.style.cursor = 'pointer';
                        break;
                    case 'shape':
                        this.canvas.style.cursor = 'crosshair';
                        break;
                    case 'text':
                        this.canvas.style.cursor = 'text';
                        break;
                }
            });
        });
        
        // Settings
        this.opacitySlider.addEventListener('input', (e) => {
            this.opacity = parseInt(e.target.value) / 100;
            this.opacityValue.textContent = `${e.target.value}%`;
        });
        
        this.symmetryCheckbox.addEventListener('change', (e) => {
            this.symmetryMode = e.target.checked;
        });
        
        this.gridCheckbox.addEventListener('change', (e) => {
            this.gridVisible = e.target.checked;
            const gridOverlay = document.getElementById('grid-overlay');
            gridOverlay.style.display = this.gridVisible ? 'block' : 'none';
        });
        
        this.pressureCheckbox.addEventListener('change', (e) => {
            this.pressureSensitive = e.target.checked;
        });
        
        // Stamps
        this.stampOptions.forEach(el => {
            el.addEventListener('click', () => {
                this.currentStamp = el.dataset.stamp;
                this.showToast(`Selected stamp: ${this.currentStamp}`);
            });
        });
        
        // Action buttons
        this.clearBtn.addEventListener('click', () => this.clearCanvas());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        this.saveBtn.addEventListener('click', () => this.saveDrawing());
        this.exportBtn.addEventListener('click', () => this.exportPNG());
        this.loadBtn.addEventListener('click', () => this.openModal());
        this.refreshGalleryBtn.addEventListener('click', () => this.loadSavedDrawings());
        this.clearGalleryBtn.addEventListener('click', () => this.clearAllDrawings());
        
        // Modal events
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.closeModalBtn2.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'z':
                        e.preventDefault();
                        this.undo();
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveDrawing();
                        break;
                }
            }
        });
        
        // Mouse coordinates
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / this.zoomLevel);
            const y = Math.round((e.clientY - rect.top) / this.zoomLevel);
            this.mouseX.textContent = x;
            this.mouseY.textContent = y;
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.lastX = (e.clientX - rect.left) * scaleX;
        this.lastY = (e.clientY - rect.top) * scaleY;
        
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        
        if (this.currentTool === 'fill') {
            this.floodFill(this.lastX, this.lastY);
            this.saveToHistory();
            this.isDrawing = false;
        } else if (this.currentTool === 'shape') {
            // Start drawing shape
            this.tempCtx.beginPath();
            this.tempCtx.moveTo(this.lastX, this.lastY);
        } else if (this.currentTool === 'text') {
            const text = prompt('Enter text:', 'Hello World');
            if (text) {
                this.ctx.font = `${this.brushSize * 4}px Arial`;
                this.ctx.fillStyle = this.brushColor;
                this.ctx.fillText(text, this.lastX, this.lastY);
                this.saveToHistory();
            }
            this.isDrawing = false;
        } else if (this.currentStamp) {
            this.drawStamp(this.lastX, this.lastY);
            this.saveToHistory();
            this.isDrawing = false;
        }
    }

    draw(e) {
        if (!this.isDrawing || this.currentTool === 'fill' || 
            this.currentTool === 'text' || this.currentStamp) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
        
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        
        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            // Draw on temp canvas for preview
            this.tempCtx.lineWidth = this.brushSize;
            this.tempCtx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.brushColor;
            this.tempCtx.globalAlpha = this.opacity;
            
            this.tempCtx.beginPath();
            this.tempCtx.moveTo(this.lastX, this.lastY);
            this.tempCtx.lineTo(currentX, currentY);
            this.tempCtx.stroke();
            
            if (this.symmetryMode) {
                this.symmetryCtx.clearRect(0, 0, this.symmetryCanvas.width, this.symmetryCanvas.height);
                
                // Draw symmetrical preview
                const centerX = this.canvas.width / 2;
                const mirroredX = centerX - (currentX - centerX);
                const mirroredLastX = centerX - (this.lastX - centerX);
                
                this.symmetryCtx.lineWidth = this.brushSize;
                this.symmetryCtx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.brushColor;
                this.symmetryCtx.globalAlpha = this.opacity;
                
                this.symmetryCtx.beginPath();
                this.symmetryCtx.moveTo(mirroredLastX, this.lastY);
                this.symmetryCtx.lineTo(mirroredX, currentY);
                this.symmetryCtx.stroke();
            }
        } else if (this.currentTool === 'shape') {
            // Draw shape preview
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.tempCtx.lineWidth = this.brushSize;
            this.tempCtx.strokeStyle = this.brushColor;
            this.tempCtx.globalAlpha = this.opacity;
            
            const width = currentX - this.lastX;
            const height = currentY - this.lastY;
            
            this.tempCtx.strokeRect(this.lastX, this.lastY, width, height);
        }
        
        this.lastX = currentX;
        this.lastY = currentY;
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            // Commit temp drawing to main canvas
            this.ctx.drawImage(this.tempCanvas, 0, 0);
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            
            if (this.symmetryMode) {
                this.ctx.drawImage(this.symmetryCanvas, 0, 0);
                this.symmetryCtx.clearRect(0, 0, this.symmetryCanvas.width, this.symmetryCanvas.height);
            }
        } else if (this.currentTool === 'shape') {
            // Commit shape to main canvas
            this.ctx.drawImage(this.tempCanvas, 0, 0);
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        }
        
        this.saveToHistory();
    }

    drawStamp(x, y) {
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = this.brushColor;
        this.ctx.globalAlpha = this.opacity;
        
        let symbol = '⭐';
        switch(this.currentStamp) {
            case 'heart': symbol = '❤️'; break;
            case 'star': symbol = '⭐'; break;
            case 'flower': symbol = '🌸'; break;
            case 'cloud': symbol = '☁️'; break;
            case 'check': symbol = '✅'; break;
            case 'fire': symbol = '🔥'; break;
        }
        
        this.ctx.fillText(symbol, x - 20, y + 20);
        this.ctx.globalAlpha = 1.0;
    }

    floodFill(startX, startY) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const targetColor = this.getPixelColor(data, startX, startY);
        const fillColor = this.hexToRgba(this.brushColor);
        
        if (this.colorsMatch(targetColor, fillColor)) {
            return; // Same color, no need to fill
        }
        
        const stack = [[startX, startY]];
        const visited = new Set();
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            
            if (visited.has(key) || x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
                continue;
            }
            
            const currentColor = this.getPixelColor(data, x, y);
            
            if (this.colorsMatch(currentColor, targetColor)) {
                this.setPixelColor(data, x, y, fillColor);
                visited.add(key);
                
                // Add neighbors
                stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    getPixelColor(data, x, y) {
        const index = (y * this.canvas.width + x) * 4;
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }

    setPixelColor(data, x, y, color) {
        const index = (y * this.canvas.width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a * this.opacity * 255;
    }

    colorsMatch(c1, c2) {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    }

    hexToRgba(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b, a: 1.0 };
    }

    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveToHistory();
        this.showToast('Canvas cleared');
    }

    saveToHistory() {
        // Remove any future states if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Save current state
        const imageData = this.canvas.toDataURL();
        this.history.push(imageData);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        this.historyIndex = this.history.length - 1;
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreFromHistory();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreFromHistory();
        }
    }

    restoreFromHistory() {
        const image = new Image();
        image.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = this.history[this.historyIndex];
        this.updateUndoRedoButtons();
    }

    updateUndoRedoButtons() {
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    async saveDrawing() {
        const name = prompt('Enter a name for your drawing:', `Drawing_${new Date().toISOString().slice(0, 10)}`);
        if (!name) return;
        
        const dataUrl = this.canvas.toDataURL('image/png');
        
        const drawing = {
            name,
            dataUrl,
            format: 'png',
            width: this.canvas.width,
            height: this.canvas.height,
            createdDate: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/drawing-app/api/drawings/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(drawing)
            });
            
            if (response.ok) {
                this.showToast('Drawing saved successfully!');
                this.loadSavedDrawings();
            } else {
                throw new Error('Failed to save drawing');
            }
        } catch (error) {
            // Fallback to localStorage if API fails
            this.saveToLocalStorage(drawing);
            this.showToast('Drawing saved locally');
        }
    }

    saveToLocalStorage(drawing) {
        const drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
        drawing.id = Date.now().toString();
        drawings.push(drawing);
        localStorage.setItem('drawings', JSON.stringify(drawings));
        this.loadSavedDrawings();
    }

    async loadSavedDrawings() {
        try {
            const response = await fetch('/drawing-app/api/drawings/all');
            let drawings = [];
            
            if (response.ok) {
                drawings = await response.json();
            } else {
                // Fallback to localStorage
                drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
            }
            
            this.displayDrawingsInGallery(drawings);
        } catch (error) {
            // Fallback to localStorage
            const drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
            this.displayDrawingsInGallery(drawings);
        }
    }

    displayDrawingsInGallery(drawings) {
        this.galleryGrid.innerHTML = '';
        
        if (drawings.length === 0) {
            this.galleryGrid.innerHTML = '<p class="no-drawings">No saved drawings yet.</p>';
            return;
        }
        
        drawings.reverse().forEach(drawing => {
            const drawingEl = document.createElement('div');
            drawingEl.className = 'gallery-item';
            drawingEl.dataset.id = drawing.id;
            
            drawingEl.innerHTML = `
                <div class="gallery-thumbnail" style="background-image: url('${drawing.dataUrl}')"></div>
                <div class="gallery-info">
                    <strong>${drawing.name}</strong><br>
                    <small>${new Date(drawing.createdDate).toLocaleDateString()}</small><br>
                    <small>${drawing.width}x${drawing.height}</small>
                </div>
            `;
            
            drawingEl.addEventListener('click', () => this.loadDrawing(drawing));
            this.galleryGrid.appendChild(drawingEl);
        });
    }

    loadDrawing(drawing) {
        const image = new Image();
        image.onload = () => {
            this.setCanvasSize(drawing.width, drawing.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(image, 0, 0);
            this.saveToHistory();
            this.showToast(`Loaded: ${drawing.name}`);
            this.closeModal();
        };
        image.src = drawing.dataUrl;
    }

    async clearAllDrawings() {
        if (!confirm('Are you sure you want to delete all saved drawings?')) {
            return;
        }
        
        try {
            const response = await fetch('/drawing-app/api/drawings/clear', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                localStorage.removeItem('drawings');
                this.loadSavedDrawings();
                this.showToast('All drawings cleared');
            }
        } catch (error) {
            localStorage.removeItem('drawings');
            this.loadSavedDrawings();
            this.showToast('All drawings cleared');
        }
    }

    exportPNG() {
        const link = document.createElement('a');
        link.download = `drawing_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        this.showToast('Drawing exported as PNG');
    }

    zoom(delta) {
        this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel + delta));
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.zoomLevelDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.loadDrawingsInModal();
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    async loadDrawingsInModal() {
        try {
            const response = await fetch('/drawing-app/api/drawings/all');
            let drawings = [];
            
            if (response.ok) {
                drawings = await response.json();
            } else {
                drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
            }
            
            this.drawingsList.innerHTML = '';
            
            drawings.reverse().forEach(drawing => {
                const drawingEl = document.createElement('div');
                drawingEl.className = 'drawing-item';
                
                drawingEl.innerHTML = `
                    <div class="drawing-thumbnail" style="background-image: url('${drawing.dataUrl}')"></div>
                    <div class="drawing-info">
                        <strong>${drawing.name}</strong><br>
                        <small>${new Date(drawing.createdDate).toLocaleDateString()}</small>
                    </div>
                    <button class="btn-load" data-id="${drawing.id}">Load</button>
                `;
                
                drawingEl.querySelector('.btn-load').addEventListener('click', () => {
                    this.loadDrawing(drawing);
                });
                
                this.drawingsList.appendChild(drawingEl);
            });
        } catch (error) {
            this.drawingsList.innerHTML = '<p>Failed to load drawings</p>';
        }
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the drawing app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DrawingApp();
});