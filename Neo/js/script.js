
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

//////////////////////////////////////
// SECTION texture loader
const textureLoader = new THREE.TextureLoader();

//////////////////////////////////////
// SECTION load textures for asteroids, earth, and satellites
const marsTexture = textureLoader.load("./image/asteroids.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const satelliteTexture = textureLoader.load("./image/satellite.jpg");

//////////////////////////////////////
// SECTION display description function
const displayDescription = (description) => {
  let descriptionDiv = document.getElementById('asteroid-description');
  if (!descriptionDiv) {
    descriptionDiv = document.createElement('div');
    descriptionDiv.id = 'asteroid-description';

    // Apply card-like styles
    descriptionDiv.style.position = 'absolute';
    descriptionDiv.style.top = '20px'; // Slightly adjusted positioning
    descriptionDiv.style.left = '20px';
    descriptionDiv.style.color = '#333'; // Darker text color for contrast
    descriptionDiv.style.backgroundColor = 'white'; // White background for card
    descriptionDiv.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)'; // Soft shadow for card effect
    descriptionDiv.style.padding = '15px'; // Padding for better spacing
    descriptionDiv.style.borderRadius = '8px'; // Rounded corners for a card-like feel
    descriptionDiv.style.fontFamily = 'Arial, sans-serif'; // Font style
    descriptionDiv.style.fontSize = '14px'; // Adjusted font size for readability
    descriptionDiv.style.maxWidth = '300px'; // Set a maximum width for the card
    descriptionDiv.style.lineHeight = '1.5'; // Line height for better readability

    document.body.appendChild(descriptionDiv);
  }

  descriptionDiv.textContent = description; // Set the description text
};


//////////////////////////////////////
// SECTION create scene
const createScene = (asteroidData) => {
  const max_view = 1000; // Set maximum view distance

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();

  const starTexture = textureLoader.load("./image/stars.jpg");
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const cubeTexture = cubeTextureLoader.load([
    starTexture,
    starTexture,
    starTexture,
    starTexture,
    starTexture,
    starTexture,
  ]);
  scene.background = cubeTexture;

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.5,
    max_view
  );
  // Restore original camera position
  camera.position.set(0, 200, 0)

  camera.lookAt(0, 90, 0);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.05;
  orbit.autoRotate = true;
  orbit.autoRotateSpeed = 0.5;
  orbit.zoomSpeed = 3;
  orbit.target.set(0, 0, 0);
  orbit.update();

  const earthGeo = new THREE.SphereGeometry(20, 50, 50);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
  });
  const earth = new THREE.Mesh(earthGeo, earthMaterial);
  earth.receiveShadow = true;
  scene.add(earth);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // SECTION Generate asteroid function
  const generateAsteroid = (asteroid) => {
    const asteroidGeometry = new THREE.SphereGeometry(asteroid.size / 20, 7, 29);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
    });
    const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroidMesh.castShadow = true;

    const angle = (Math.random() * 360) * (Math.PI / 180);
    const x = Math.cos(angle) * asteroid.distance / 100000;
    const z = Math.sin(angle) * asteroid.distance / 100000;
    const y = (Math.random() - 0.5) * 50; // Random Y-axis position

    asteroidMesh.position.set(x, y, z);
    scene.add(asteroidMesh);

    asteroidMesh.userData = { description: `Name: ${asteroid.fullname}, Distance : ${asteroid.distance}m ,Speed: ${asteroid.speed}km/s Size: ${asteroid.size} m` }; // Store asteroid description
    console.log(asteroid)
    return {
      asteroidObj: asteroidMesh,
      asteroid: asteroidMesh,
      rotationSpeed: asteroid.speed / 1000, // Reduce speed for smoother animation
    };
  };

  const asteroidsInScene = [];
  asteroidData.forEach((asteroid) => {
    const { asteroidObj, asteroid: asteroidMesh, rotationSpeed } = generateAsteroid(asteroid);
    asteroidsInScene.push({ asteroidObj, asteroidMesh, rotationSpeed });
  });

  // object click
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      asteroidsInScene.map(item => item.asteroidMesh), true
    );

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      displayDescription(selectedObject.userData.description);
    }
  });

  // SECTION Animate scene
  function animate() {
    asteroidsInScene.forEach(({ asteroidObj, rotationSpeed }) => {
      asteroidObj.rotateY(rotationSpeed);
    });

    orbit.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  return { renderer, camera };
};

//////////////////////////////////////
// SECTION Fetch API data and start scene
async function fetchAsteroidsData() {
  try {
    const response = await fetch('https://flask-app-30d4e-default-rtdb.firebaseio.com/.json');
    const data = await response.json();
    const asteroidData = data.users2.Asteroid_info; // Accessing the asteroid info from API
    createScene(asteroidData); // Pass fetched data to the scene creation
  } catch (error) {
    console.error("Error fetching asteroid data:", error);
  }
}

// Start fetching data when the page loads
fetchAsteroidsData();

//////////////////////////////////////
// SECTION - resize camera view
window.addEventListener("resize", () => {
  const { camera, renderer } = sceneInstance;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
