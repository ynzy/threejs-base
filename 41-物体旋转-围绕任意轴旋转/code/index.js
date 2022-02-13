// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, raycaster, renderer;

// 鼠标的默认位置是一个二维向量, 当前选中的物体
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
    // 初始化渲染器
    initRenderer();
    // 初始化场景
    initScene();
    // 初始化灯光
    initLight();
    // 初始化相机
    initCamera();
    // 初始化物体
    initObject();
    // 初始化网格
    initGrid();
    // 初始化性能监控
    initStats();
    // 初始化布控球
    initControls()
    // 渲染循环
    animate();
    window.addEventListener("resize", onWindowResize, false);
}

function initView() {
    container = document.createElement("div");
    document.body.appendChild(container);
}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    // 环境光
    light = new THREE.AmbientLight(0xff0000);
    light.position.set(100, 100, 200);
    scene.add(light);
}

const near = 1
const far = 10000

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
    camera.position.x = 100;
    camera.position.y = 300;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
      x: 0,
      y: 0,
      z: 0,
    });
}

 var cube;
 var mesh;
 var group;
// 初始化物体
function initObject() {
  var geometry = new THREE.BoxGeometry(100, 100, 100);
  // 给立方体的面赋值 随机颜色
  for (var i = 0; i < geometry.faces.length; i += 2) {
    var hex = Math.random() * 0xffffff;
    // 相邻两个面颜色是一样的
    geometry.faces[i].color.setHex(hex);
    geometry.faces[i + 1].color.setHex(hex);
  }

  var material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position = new THREE.Vector3(0, 0, 0);
  scene.add(mesh);

}

function initGrid() {
  // 网格辅助坐标
  var gridHelper = new THREE.GridHelper(1000, 50);
  gridHelper.setColors(0x0000ff, 0x808080);
  scene.add(gridHelper);

  var axisHelper = new THREE.AxisHelper(1000);
  scene.add(axisHelper);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
}

function animate() {
    render();
    update();
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}


var angle = 0.01;
function update() {
  var v1 = new THREE.Vector3(1,1,0)
  mesh.rotateOnAxis(v1,angle)
  stats.update();
  controls.update();
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

var controls;
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}