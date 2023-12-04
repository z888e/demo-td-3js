document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 15); 

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Container
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Light
    const directionalLight = new THREE.DirectionalLight(0xff00ff, 1.2);
    directionalLight.position.set(10, 5, 10);
    scene.add(directionalLight);

    // Shape
    let currentShape = 'torus'; 
    const changeShapeButton = document.getElementById('change-shape-button');
    let cube, torus;

    // Material
    const createMaterial = () => {
        return new THREE.MeshToonMaterial({ color: 0x002FA7 });
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
        const geometry = new THREE.TorusGeometry(0.7, 0.2, 30, 4);
        const material = createMaterial();
        torus = new THREE.Mesh(geometry, material);
        return torus;
    };

    // Switch Shape variable
    var switchShape = 1;

    // Change Rotation variable
    var changeRotation = 0.07;

    // Matrix settings
    const matrixSize = 9; 
    const spacing = 2; 
    var matrixObjects = []

    // Delayed rotation in milliseconds
    const rotationDelay = 800;

    // Matrix
    const makeMatrix = (shapeType) => {
        matrixObjects.forEach((object) => {
            scene.remove(object.shape);
        });
    
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                let object;
                if (switchShape === 1) {
                    object = createCube();
                    currentShape = 'cube';
                } else if (switchShape === 0) {
                    object = createTorus();
                    currentShape = 'torus';
                }
                const position = new THREE.Vector3((i - 1) * spacing, (j - 1) * spacing, 0); 
                object.position.copy(position); 
                scene.add(object);
                  
                const rotationDelayOffset = (j * matrixSize + i) + rotationDelay;
                setTimeout(() => {
                    rotateObject(object);
                }, rotationDelayOffset);

                // Object that contains both shape and position
                const matrixObject = {
                    shape: object,
                    position: position,
                };
    
                matrixObjects.push(matrixObject);
            }
        }
    
        return matrixObjects; 
    };
    
    // Create the matrix 
    matrixObjects = makeMatrix(currentShape);

    const animate = () => {
        requestAnimationFrame(animate);

        // Access objects and their positions
        matrixObjects.forEach((matrixObject) => {
                const shape = matrixObject.shape;
                const position = matrixObject.position;
        
                shape.rotation.x += changeRotation / 10;
                shape.rotation.y += changeRotation / 10;
                shape.rotation.z += changeRotation / 10;
            });

        renderer.render(scene, camera);
    };

    changeShapeButton.addEventListener('click', () => {
        // Toggle between 0 and 1
        switchShape = 1 - switchShape; 
        // Regenerate the matrix with the new shape
        makeMatrix(currentShape); 
    });

    animate();
});