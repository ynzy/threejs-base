var width, height;
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
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    light = new THREE.AmbientLight(0xFF0000);
    light.position.set(100, 100, 200);
    scene.add(light);

    light = new THREE.PointLight(0x00FF00);
    light.position.set(0, 0, 300);
    scene.add(light);
}

var cube;
function initObject() {
    // 圆柱体 上面圆半径，下面圆半径，圆柱体的高
    var geometry = new THREE.CylinderGeometry(70, 100, 200, 20);
    // 一种非光泽表面的材质，可以当作表面粗糙的材质，反射效率会比较平均
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);
}
var param;
function createUI() {
    var ParamObj = function () {
        this.fov = 45
    }
    param = new ParamObj()
    var gui = new dat.GUI()
    gui.add(param, "fov", 0, 180).name('视角的大小')
}
function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    createUI()
    animation();

}
function animation() {
    changeFov();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

function setCameraFov(fov) {
    camera.fov = fov; // 设置相机的视角
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
}

function changeFov() {
    setCameraFov(param.fov);
}
window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});