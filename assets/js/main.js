// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 25, 50);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
document.body.appendChild(renderer.domElement);

// Add light with shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Function to create a texture with text
function createTextTexture(text, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    context.fillStyle = '#007bff'; // Background color
    context.fillRect(0, 0, width, height);

    context.font = 'Bold 30px Arial';
    context.fillStyle = '#ffffff'; // Text color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, width / 2, height / 2);

    return new THREE.CanvasTexture(canvas);
}

// Function to create a cube with border and text
function createCubeWithBorder(size, text, position) {
    const materials = [];

    // Create materials with text for each face
    for (let i = 0; i < 6; i++) {
        const texture = createTextTexture(text, 256, 256);
        materials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }

    const geometry = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(geometry, materials);

    cube.position.copy(position);
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Add borders using LineSegments
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    cube.add(line);

    return cube;
}

// Create a pyramid with cubes
const levels = 10; // Number of layers
const boxSize = 3;

for (let i = 0; i < levels; i++) {
    const levelSize = levels - i;
    const yOffset = i * boxSize;

    for (let x = 0; x < levelSize; x++) {
        for (let z = 0; z < levelSize; z++) {
            const xOffset = (x - (levelSize - 1) / 2) * boxSize;
            const zOffset = (z - (levelSize - 1) / 2) * boxSize;

            const cube = createCubeWithBorder(boxSize, 'John Doe', new THREE.Vector3(xOffset, yOffset, zOffset));
            scene.add(cube);
        }
    }
}

// Function to create a rectangle with text (similar to the image you provided)
function createNotificationRectangle(text) {
    const width = 5;
    const height = 2;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    context.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Semi-transparent background
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'Bold 30px Arial';
    context.fillStyle = '#000000'; // Text color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    const rectangle = new THREE.Mesh(geometry, material);
    rectangle.position.set(0, 10, 0); // Position the rectangle above the pyramid

    return rectangle;
}

// Add the notification rectangle to the scene
const notificationRectangle = createNotificationRectangle('This is the content of the notification.');
scene.add(notificationRectangle);

// Add orbit controls with limited scrolling
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 30;  // Minimum distance from the center of the scene
controls.maxDistance = 80;  // Maximum distance from the center of the scene

// Set the center of controls to the center of the pyramid
controls.target.set(0, (levels * boxSize) / 2 - boxSize / 2, 0); // Adjust Y-axis to center vertically

// Disable zoom using scroll wheel beyond the limits
controls.enableZoom = true;
controls.zoomSpeed = 1.2;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Update the controls
    renderer.render(scene, camera);
}

// Adjust the scene when the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
