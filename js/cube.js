const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '9999';
canvas.style.background = 'black';
document.body.appendChild(canvas);

const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];

const cubePoints = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1]
];

const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

let angleX = 0;
let angleY = 0;
let angleZ = 0;
let colorIndex = 0;
const colorSpeed = 0.002;

const colors = [
    [255, 0, 0],
    [255, 127, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [75, 0, 130],
    [148, 0, 211],
    [255, 20, 147]
];

function rotatePoint(point, angleX, angleY, angleZ) {
    let [x, y, z] = point;
    
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const newY = y * cosX - z * sinX;
    const newZ = y * sinX + z * cosX;
    y = newY;
    z = newZ;
    
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const newX = x * cosY + z * sinY;
    const newZ2 = -x * sinY + z * cosY;
    x = newX;
    z = newZ2;
    
    const cosZ = Math.cos(angleZ);
    const sinZ = Math.sin(angleZ);
    const newX2 = x * cosZ - y * sinZ;
    const newY2 = x * sinZ + y * cosZ;
    x = newX2;
    y = newY2;
    
    return [x, y, z];
}

function projectPoint(point, width, height) {
    let [x, y, z] = point;
    const distance = 8;
    if (z + distance <= 0) {
        return [width / 2, height / 2];
    }
    const factor = distance / (distance + z);
    x = x * factor * 150 + width / 2;
    y = y * factor * 150 + height / 2;
    return [Math.floor(x), Math.floor(y)];
}

function getInterpolatedColor(color1, color2, factor) {
    const r = Math.floor(color1[0] * (1 - factor) + color2[0] * factor);
    const g = Math.floor(color1[1] * (1 - factor) + color2[1] * factor);
    const b = Math.floor(color1[2] * (1 - factor) + color2[2] * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

function drawCube() {
    const rotatedPoints = [];
    for (const point of cubePoints) {
        const rotated = rotatePoint(point, angleX, angleY, angleZ);
        const projected = projectPoint(rotated, canvas.width, canvas.height);
        rotatedPoints.push(projected);
    }
    
    for (const edge of cubeEdges) {
        const start = rotatedPoints[edge[0]];
        const end = rotatedPoints[edge[1]];
        
        const color1 = colors[Math.floor(colorIndex) % colors.length];
        const color2 = colors[(Math.floor(colorIndex) + 1) % colors.length];
        const factor = colorIndex - Math.floor(colorIndex);
        const color = getInterpolatedColor(color1, color2, factor);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }
}

function main() {
    const keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === 'Escape' || e.key === 'q') {
            document.body.removeChild(canvas);
            return;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    function animate() {
        if (keys['ArrowLeft']) {
            angleY -= 0.01;
        }
        if (keys['ArrowRight']) {
            angleY += 0.01;
        }
        if (keys['ArrowUp']) {
            angleX -= 0.01;
        }
        if (keys['ArrowDown']) {
            angleX += 0.01;
        }
        
        angleX += 0.003;
        angleY += 0.002;
        angleZ += 0.0015;
        
        colorIndex += colorSpeed;
        if (colorIndex >= colors.length) {
            colorIndex = 0;
        }
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawCube();
        
        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        const infoText = `X = ${angleX.toFixed(1)} | Y = ${angleY.toFixed(1)} | Z = ${angleZ.toFixed(1)}`;
        ctx.fillText(infoText, 10, 40);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

main();
