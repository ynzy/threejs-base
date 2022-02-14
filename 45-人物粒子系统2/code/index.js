const base_url = "https://threejs-models.vercel.app";
// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;

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
const far = 50000;

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.set(0,700,7000)
  camera.lookAt(scene.position)
}

var jsonLoader,binaryLoader;
// 加载 JSON、Binary模型
// 初始化物体
function initObject() {
  jsonLoader = new THREE.JSONLoader()
  binaryLoader = new THREE.BinaryLoader();
  // 加载地形模型
  jsonLoader.load("../../static/models/json/terrain.js", function (geometry) {
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    }); // wireframe: true
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });

  // 加载车模型
  // binaryLoader.load(
  //   "../../static/models/binary/veyron/VeyronNoUv_bin.js",
  //   function (geometry) {
  //     var material = new THREE.MeshBasicMaterial({
  //       color: 0xffff00,
  //       wireframe: true,
  //     });
  //     var mesh = new THREE.Mesh(geometry, material);
  //     scene.add(mesh);
  //   }
  // );
   createMeshByBinary({
     meshName: "车模型",
     url: "../../static/models/binary/veyron/VeyronNoUv_bin.js",
     materialColor: 0xffff00,
     wireframe: true,
   });

  // 加载女人模型
  // binaryLoader.load(
  //   "../../static/models/obj/female02/Female02_bin.js",
  //   function (geometry) {
  //     var material = new THREE.MeshBasicMaterial({
  //       color: 0xff00ff,
  //       wireframe: true,
  //     });
  //     var mesh = new THREE.Mesh(geometry, material);
  //     scene.add(mesh);
  //   }
  // );

  createMeshByBinary({
    meshName: "女人模型",
    url: "../../static/models/obj/female02/Female02_bin.js",
    materialColor: 0xff00ff,
    wireframe: true,
  });

  // 加载男人模型
  // binaryLoader.load(
  //   "../../static/models/obj/male02/Male02_bin.js",
  //   function (geometry) {
  //     var material = new THREE.MeshBasicMaterial({
  //       color: 0xff0000,
  //       wireframe: true,
  //     });
  //     var mesh = new THREE.Mesh(geometry, material);
  //     scene.add(mesh);
  //   }
  // );
  createMeshByBinary({
    meshName: '男人模型',
    url: "../../static/models/obj/male02/Male02_bin.js",
    materialColor: 0xff0000,
    wireframe: true,
  });
}

/**
 * 通过二进制模型添加到场景中
 * @param {*} meshName 模型名字
 * @param {*} url 模型url
 * @param {*} materialColor 材质颜色
 * @param {*} wireframe 是否开启线框
 */
function createMeshByBinary({meshName, url, materialColor, wireframe }) {
  binaryLoader.load(url, function (geometry) {
    var material = new THREE.MeshBasicMaterial({
      color: materialColor || 0xff0000,
      wireframe,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = meshName;
    scene.add(mesh);
  });
}



function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setClearColor(0xffffff, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.autoClear = false;
  renderer.sortObjects = false
  container.appendChild(renderer.domElement);
}

function animate() {
  render();
  update();
  requestAnimationFrame(animate);
}

function render() {
  renderer.clear()
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
