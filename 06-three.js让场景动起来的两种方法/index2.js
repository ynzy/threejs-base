var width, height
var renderer;
function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    light = new THREE.PointLight(0x00FF00);
    light.position.set(0, 0, 300);
    scene.add(light);
}

var cube;
var mesh;
function initObject() {
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    animation();
}
// 定义循环
function animation() {
    // camera.position.x += 1;
    mesh.position.x -= 1;
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}


window.addEventListener("load", function (event) {
    threeStart();
});