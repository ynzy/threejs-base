// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, raycaster, renderer;

// 鼠标的默认位置是一个二维向量
var mouse = new THREE.Vector2(), INTERSECTED;
// theta 旋转角度
var radius = 100, theta = 0;

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});


function threeStart() {
    // 初始化视图
    initView();
    // 初始化场景
    initScene();
    // 初始化灯光
    initLight();
    // 初始化相机
    initCamera();
    // 初始化物体
    initObject();
    // 初始化渲染器
    initRenderer();
    // 初始化性能监控
    initStats();
    // 渲染循环
    animate();

}


var fullWidth = 550;
var fullHeight = 600;

function initView() {
    container = document.createElement("div");
    document.body.appendChild(container);
}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    // 平行光
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
}

const near = 1
const far = 10000

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
}


// 初始化物体
function initObject() {
    // 盒子
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    
    // 创建2000个随机物体
    for (var i = 0; i < 2000; i++) {
      // 创建材质，材质颜色是随机的
      var material = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      });

      var object = new THREE.Mesh(geometry, material);
      // 随机位置
      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;
      // 随机旋转
      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;
      // 随机大小
      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;

      scene.add(object);
    }
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    container.appendChild(renderer.domElement);
}

function animate() {
  render();
  stats.update();
  requestAnimationFrame(animate);
}


function render() {
    theta += 0.1;

    // 摄像机围绕一个球进行旋转
    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
    camera.lookAt(scene.position);
    // 更新相机矩阵
    camera.updateMatrixWorld();

    renderer.render(scene, camera);
}


var stats;
function initStats() {
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // 将stats的界面对应左上角
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild(stats.dom);
}