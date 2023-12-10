import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 45);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05; 
controls.rotateSpeed = 5;

// Container
const container = document.getElementById('container');
container.appendChild(renderer.domElement);

// Light
const directionalLight = new THREE.DirectionalLight(0xff00ff, 1);
directionalLight.position.set(10, 5, 10);
directionalLight.shadowMapVisible = true;
scene.add(directionalLight);

// Shape
let currentShape = 'cube';
const changeShapeButton = document.getElementById('change-shape-button');
let cube, torus;

// Material
const createMaterial = () => {
    return new THREE.MeshToonMaterial({ color: 0x0F2FA7 });
};

// Shape 1
const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 64);
    const material = createMaterial();
    cube = new THREE.Mesh(geometry, material);
    return cube;
};

// Shape 2
const createTorus = () => {
    const geometry = new THREE.TorusGeometry(2, 0.1, 30, 12);
    const material = createMaterial();
    torus = new THREE.Mesh(geometry, material);
    return torus;
};

// Switch Shape variable
var switchShape = 1;

// Change Rotation variable
var changeRotation = 0.05;

// Matrix settings
const matrixSize = 9;
const spacing = 3;
const matrixDepth = matrixSize;
var matrixObjects = [];

// Delayed rotation in milliseconds
const rotationDelay = 4000;

// Matrix
const makeMatrix = (shapeType) => {
    matrixObjects.forEach((layer) => {
        layer.forEach((object) => {
            scene.remove(object.shape);
        });
    });

    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            for (let k = 0; k < matrixDepth; k++) {
                let object;
                if (switchShape === 1) {
                    object = createCube();
                    currentShape = 'cube';
                } else if (switchShape === 0) {
                    object = createTorus();
                    currentShape = 'torus';
                }
                const position = new THREE.Vector3((i - 1) * spacing, (j - 1) * spacing, k * spacing);
                object.position.copy(position);
                scene.add(object);

                const rotationDelayOffset = (j * matrixSize + i * matrixSize + k * matrixSize) + rotationDelay;
                setTimeout(() => {
                    rotateObject(object);
                }, rotationDelayOffset);

                // Object that contains both shape and position
                const matrixObject = {
                    shape: object,
                    position: position,
                };

                // Create the matrix layer if it doesn't exist
                if (!matrixObjects[k]) {
                    matrixObjects[k] = [];
                }
                matrixObjects[k].push(matrixObject);
            }
        }
    }

    // Center the camera via OrbitControls
    controls.target.set(matrixSize, matrixSize, matrixSize);
    controls.update();

    return matrixObjects;
};

// Create the matrix 
matrixObjects = makeMatrix(currentShape);

// Start rotation for delay onset
const rotateObject = (object) => {
    object.rotation.x += changeRotation;
    object.rotation.y += changeRotation;
    object.rotation.z += changeRotation;
};

const animate = () => {
    requestAnimationFrame(animate);

    // Access objects and their positions
    matrixObjects.forEach((layer) => {
        layer.forEach((matrixObject) => {
            const shape = matrixObject.shape;
            shape.rotation.x += changeRotation / 10;
            shape.rotation.y += changeRotation / 10;
            shape.rotation.z += changeRotation / 10;
        });
    });

    controls.update();
    renderer.render(scene, camera);
};

changeShapeButton.addEventListener('click', () => {
    // Toggle between 0 and 1
    switchShape = 1 - switchShape;
    // Regenerate the matrix with the new shape
    makeMatrix(currentShape);
});

animate();