var width, height;
let scene, camera, renderer, controls, guiControls;
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

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 600;
    camera.position.y = 600;
    camera.position.z = 1000;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

function initScene() {
    scene = new THREE.Scene();
}

var param;
var light;
var lightPos
function initLight() {
    var ParamObj = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    param = new ParamObj();
    var gui = new dat.GUI();
    gui.add(param, "x", -10000, 10000).name('环境光X的位置')
    gui.add(param, "y", -10000, 10000).name('环境光Y的位置')
    gui.add(param, "z", -10000, 10000).name('环境光Z的位置')
    // 环境光定义为红色
    light = new THREE.AmbientLight(0x00ff00); // 0xFF0000
    light.position.set(param.x, param.y, param.z);
    scene.add(light);
}
/* 控制器 */
function initControls() {

    /* 轨迹球控件 */
    controls = new THREE.TrackballControls(camera, renderer.domElement);

    /* 属性参数 */
    controls.rotateSpeed = 0.2;// 旋转速度
    controls.zoomSpeed = 0.2;// 缩放速度
    controls.panSpeed = 0.1;// 平controls

    controls.staticMoving = false;// 静止移动，为 true 则没有惯性
    controls.dynamicDampingFactor = 0.2;// 阻尼系数 越小 则滑动越大

    controls.minDistance = 1; // 最小视角
    controls.maxDistance = 500;// 最大视角 Infinity 无穷大
}

/* 数据更新 */
function update() {
    // stats.update();
    controls.update();
}
/* 窗口变动触发 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var cube;
function initObject() {
    var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    // 定义材质为红色
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);
}



function changeLightPos() {
    light.position.set(param.x, param.y, param.z);
}

function animation() {
    changeLightPos();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
    update()
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initControls();
    initObject();
    animation();
    /* 监听事件 */
    window.addEventListener('resize', onWindowResize, false);
}

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});