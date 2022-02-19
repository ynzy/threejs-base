const base_url = "https://threejs-models.vercel.app";
// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, camera, scene, renderer;

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
  // 初始化相机
  initCamera();
  // 初始化灯光
  initLight();
  // 初始化物体
  initObject();
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
  var light = new THREE.PointLight(0xffffff, 0.8);
  camera.add(light);
}

const near = 1;
const far = 10000;

function initCamera() {
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, near, far );
  camera.position.set(0, 150, 500);
  scene.add(camera);
}

var group;
// 初始化物体
function initObject() {
  group = new THREE.Group();
  group.position.y = 50;
  scene.add(group);

  /**
   * 创建自定义形状
   * @param {*} shape
   * @param {*} color 材质颜色
   * @param {*} x y z 是整个Mesh的位置
   * @param {*} rx ry rz 旋转
   * @param {*} s 放大缩小
   */
  function addShape(shape, color, x, y, z, rx, ry, rz, s) {
    var points = shape.createPointsGeometry(5);

    var line = new THREE.Line(
      points,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x, y, z - 25);
    line.rotation.set(rx, ry, rz);
    line.scale.set(s, s, s);
    group.add(line);
  }

  // Circle

  var circleRadius = 180;
  var circleShape = new THREE.Shape();
  circleShape.moveTo(circleRadius, 0);
  // 绘制贝塞尔曲线
  circleShape.quadraticCurveTo(0, circleRadius, -circleRadius, 0);
  console.log(circleShape);
  addShape(circleShape, 0x00f000, 0, 0, 0, 0, 0, 0, 1);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xf0f0f0, 1.0);
	renderer.setPixelRatio(window.devicePixelRatio);
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
