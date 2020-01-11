let THREE = require("three");

let scene = new THREE.Scene();

let [w, h] = [600, 600];
let aspect = w / h;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 1000);

camera.position.set(-4, 5, 13);
camera.rotation.x = (-15 * Math.PI) / 180;
camera.rotation.y = (-15 * Math.PI) / 180;
camera.rotation.z = (-3 * Math.PI) / 180;

var gridHelper = new THREE.GridHelper(20, 10);
scene.add(gridHelper);

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
let mesh;
let manager = new THREE.LoadingManager();
manager.onLoad = function() {
  drawTaiwan();
  animate();
};

let loader = new THREE.FontLoader(manager);
loader.load("assets/fonts/Taiwan icon 20_Regular.json", function(resp) {
  font = resp;
});

let textureLoader = new THREE.TextureLoader(manager);
let taiwanTexture = textureLoader.load("assets/images/taiwan-map.svg", function(
  texture
) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
});
let disk = textureLoader.load(
  "https://threejs.org/examples/textures/sprites/circle.png"
);

function drawTaiwan() {
  let globe = new THREE.SphereBufferGeometry(5, 180, 90);
  let points = new THREE.Points(
    globe,
    new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      uniforms: {
        visibility: {
          value: taiwanTexture
        },
        shift: {
          value: 0
        },
        shape: {
          value: disk
        },
        size: {
          value: 0.3
        },
        scale: {
          value: window.innerHeight / 2
        }
      },
      vertexShader: `
  				
      uniform float scale;
      uniform float size;
      
      varying vec2 vUv;
      varying vec3 vColor;
      
      void main() {
      
        vUv = uv;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( scale / length( mvPosition.xyz )) * (0.3 + sin(uv.y * 3.1415926) * 0.6 );
        gl_Position = projectionMatrix * mvPosition;

      }
  `,
      fragmentShader: `
      uniform sampler2D visibility;
      uniform float shift;
      uniform sampler2D shape;
      
      varying vec2 vUv;
      varying vec3 vColor;
      

      void main() {
      	
        vec2 uv = vUv;
        uv.x += shift;
        vec4 v = texture2D(visibility, uv);
        if (length(v.rgb) > 1.0) discard;

        gl_FragColor = vec4( vColor, 1.0 );
        vec4 shapeData = texture2D( shape, gl_PointCoord );
        if (shapeData.a < 0.0625) discard;
        gl_FragColor = gl_FragColor * shapeData;
		
      }
  `,
      transparent: false
    })
  );
  scene.add(points);
}

function animate() {
  // mesh1.rotation.y += rotateSpeed;
  // mesh2.rotation.y += rotateSpeed;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (window.canvasRecorder) {
    window.canvasRecorder.capture(renderer.domElement);
  }
}
