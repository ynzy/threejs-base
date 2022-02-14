const base_url = "https://threejs-models.vercel.app";
// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, raycaster, renderer;

// 鼠标的默认位置是一个二维向量, 当前选中的物体
var mouse = new THREE.Vector2(),
  INTERSECTED;
// theta 旋转角度
var radius = 100,
  theta = 0;

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
  initControls();
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

const near = 1;
const far = 10000;

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
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
var boxMesh,
  objMesh = undefined;
var axis2,
  axis1 = undefined;
var pivot,box;
// 初始化物体
function initObject() {
  // 加载obj模型
  var loader = new THREE.OBJLoader();
  loader.setCrossOrigin("Anonymous"); // 解决跨域问题
  // ../../static/models/obj/manHeadModel.obj
  loader.load(`${base_url}/models/obj/manHeadModel.obj`, function (object) {
    // scene.add(object);
    objMesh = object;
    axis2 = new THREE.AxisHelper(100);
    axis2.position.copy(objMesh.position);
    scene.add(axis2);

    // 模型的包围盒
    boxHelper = new THREE.BoxHelper(objMesh);
    scene.add(boxHelper);

    pivot = new THREE.Group();
    scene.add(pivot);
    pivot.add(objMesh);


    // 包含最小点和最大点的元素
    box = new THREE.Box3().setFromObject(objMesh);
    box.center(objMesh.position);
    // 所有坐标乘以一个数 
    objMesh.position.multiplyScalar(-1)
    // 把box的中心赋值给pivot.position
    box.center(pivot.position);

    axis3 = new THREE.AxisHelper(100);
    axis3.position.copy(pivot.position);
    scene.add(axis3);

  });

  // 立方体
  var geometry = new THREE.BoxGeometry(30, 30, 30);

  for (var i = 0; i < geometry.faces.length; i += 2) {
    var hex = Math.random() * 0xffffff;
    geometry.faces[i].color.setHex(hex);
    geometry.faces[i + 1].color.setHex(hex);
  }

  var material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
  });
  boxMesh = new THREE.Mesh(geometry, material);
  boxMesh.position = new THREE.Vector3(0, 0, 0);
  scene.add(boxMesh);

  axis1 = new THREE.AxisHelper(100);
  axis1.position.copy(boxMesh.position);
  scene.add(axis1);
}

function initGrid() {
  // 网格辅助坐标
  var gridHelper = new THREE.GridHelper(1000, 50);
  gridHelper.setColors(0x0000ff, 0x808080);
  scene.add(gridHelper);

  // var axisHelper = new THREE.AxisHelper(100);
  // scene.add(axisHelper);
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

function update() {
  boxMesh.rotateY(0.01);
  if (pivot != undefined) {
    pivot.rotateY(0.01);
  }
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
  controls.rotateSpeed = 0.2; // 旋转速度
  controls.zoomSpeed = 0.2; // 缩放速度
  controls.panSpeed = 0.1; // 平controls
  controls.staticMoving = false; // 静止移动，为 true 则没有惯性
  controls.dynamicDampingFactor = 0.2; // 阻尼系数 越小 则滑动越大
  controls.minDistance = near; // 最小视角
  controls.maxDistance = far; // 最大视角 Infinity 无穷大
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
