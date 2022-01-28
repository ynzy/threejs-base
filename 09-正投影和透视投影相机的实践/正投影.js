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
    // 定义正投影相机，我们以屏幕的一半设置相机中心点
    camera = new THREE.OrthographicCamera(
        window.innerWidth / -2, // 距离中心点位置一半为负数
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2, // 距离中心点位置一半为负数
        10,
        1000
    );
    // camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
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
    var geometry = new THREE.CylinderGeometry(70, 100, 200);
    // 一种非光泽表面的材质，可以当作表面粗糙的材质，反射效率会比较平均
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    var mesh = new THREE.Mesh(geometry, material);
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
function animation() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});