let THREE = require("three");

let scene = new THREE.Scene();

let [w, h] = [600, 600];
let aspect = w / h;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 1000);

camera.position.set(-4, 5, 13);
camera.rotation.x = (-15 * Math.PI) / 180;
camera.rotation.y = (-15 * Math.PI) / 180;
camera.rotation.z = (-3 * Math.PI) / 180;

// var gridHelper = new THREE.GridHelper(20, 10);
// scene.add(gridHelper);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.setClearColor("#000000");

document.body.appendChild(renderer.domElement);

var light1 = new THREE.HemisphereLight("#e57373", "#000000");
light1.position.set(-8, -5, 20);
scene.add(light1);
var light2 = new THREE.HemisphereLight("#000000", "#e57373", 0.5);
light2.position.set(8, -5, 20);
scene.add(light2);

let font;
let mesh1;
let mesh2;
let manager = new THREE.LoadingManager();
manager.onLoad = function() {
  mesh1 = drawFont();
  mesh2 = drawFont(0.5 * Math.PI);
  animate();
};
let loader = new THREE.FontLoader(manager);
loader.load("assets/fonts/ZCOOL QingKe HuangYou_Regular.json", function(resp) {
  font = resp;
});

let textureLoader = new THREE.TextureLoader(manager);
let sparkTexture = textureLoader.load(
  "assets/textures/lucky.jpeg",
  // "https://threejs.org/examples/textures/lava/lavatile.jpg",
  function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.2, 0.2);
  }
);

let glowTexture = textureLoader.load("assets/textures/glow.png");

function drawFont(y = 0) {
  let textGeometry = new THREE.TextGeometry("春", {
    font: font,
    size: 12,
    height: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.2,
    bevelSegments: 1
  });
  textGeometry.center();
  let material = new THREE.MeshPhongMaterial({
    // color: "#d32f2f",
    // specular: "#ffffff",
    emissive: "#fed85d",
    emissiveIntensity: 0.1,
    // shininess: 100,
    map: sparkTexture,
    // shading: THREE.FlatShading,
    side: THREE.DoubleSide
  });

  let mesh = new THREE.Mesh(textGeometry, material);
  mesh.position.x = 0;
  mesh.position.y = 1.6;
  mesh.position.z = 0;
  mesh.rotation.y = y;

  scene.add(mesh);

  return mesh;
}

let rotateSpeed = 0.012;

function animate() {
  mesh1.rotation.y += rotateSpeed;
  mesh2.rotation.y += rotateSpeed;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (window.canvasRecorder) {
    window.canvasRecorder.capture(renderer.domElement);
  }
}
