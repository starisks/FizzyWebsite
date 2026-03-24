const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(400, 400);
document.getElementById("cube-container").appendChild(renderer.domElement);

// Cube geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 2;

// Animation
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();