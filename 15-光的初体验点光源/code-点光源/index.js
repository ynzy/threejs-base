let width, height;
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

const near = 1;
const far = 10000
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, near, far);
    camera.position.x = 600;
    camera.position.y = 0;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

function initScene() {
    scene = new THREE.Scene();
}

let param;
let light;
let lightPos
function initLight() {
    var ParamObj = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.decay = 1;
    }
    param = new ParamObj();
    var gui = new dat.GUI();
    gui.add(param, "x", -10000, 10000).name('点光源X的位置')
    gui.add(param, "y", -10000, 10000).name('点光源Y的位置')
    gui.add(param, "z", -2000, 2000).name('点光源Z的位置')
    gui.add(param, "decay", 0, 1).name('衰减')
    // 点光源定义为红色
    light = new THREE.PointLight(0xFF0000, 1, 1000, param.decay)
    light.position.set(param.x, param.y, param.z)
    scene.add(light)
}

var cube;
function initObject() {
    var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    var geometry2 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material2 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    var mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-300, 0, 0);
    scene.add(mesh2);

    var geometry3 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
    var material3 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    var mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(0, -150, 0);
    scene.add(mesh3);

    var mesh4 = new THREE.Mesh(geometry3, material3);
    mesh4.position.set(0, 150, 0);
    scene.add(mesh4);

    var mesh5 = new THREE.Mesh(geometry3, material3);
    mesh5.position.set(300, 0, 0);
    scene.add(mesh5);

    var mesh6 = new THREE.Mesh(geometry3, material3);
    mesh6.position.set(0, 0, -100);
    scene.add(mesh6);
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

    controls.minDistance = near; // 最小视角
    controls.maxDistance = far;// 最大视角 Infinity 无穷大
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



function changeLightPos() {
    light.position.set(param.x, param.y, param.z);
    light.decay = param.decay
}

function animation() {
    changeLightPos();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
    update()
}

jscolor.presets.default = {
    width: 141,               // make the picker a little narrower
    position: 'top',        // position it to the right of the target
    previewPosition: 'right', // display color preview on the right
    previewSize: 40,          // make the color preview bigger
    format: 'hex',
    previewSize: 40,
    closeButton: true,
    closeText: '关闭',
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
};
function colorPickerUpdate(picker, selector) {
    const hex = '0x' + picker.toHEXString().replace(/#/, '')
    light.color.setHex(hex)
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



