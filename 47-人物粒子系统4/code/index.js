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
var parent;
var meshes=[];

// 加载 JSON、Binary模型
// 初始化物体
function initObject() {
  // 创建分组
  parent = new THREE.Object3D();
  scene.add(parent);

  jsonLoader = new THREE.JSONLoader();
  binaryLoader = new THREE.BinaryLoader();
  // 加载地形模型
  // "../../static/models/json/terrain.js"
  jsonLoader.load(`${base_url}/models/json/terrain.js`, function (geometry) {
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    }); // wireframe: true
    var mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
  });

  // 加载车模型
  // "../../static/models/binary/veyron/VeyronNoUv_bin.js"
  binaryLoader.load(
    `${base_url}/models/binary/veyron/VeyronNoUv_bin.js`,
    function (geometry) {
      createMesh(geometry, scene, 6.8, 2200, -200, -100, 0x0055ff, false);
    }
  );

  // 加载女人模型
  // "../../static/models/obj/female02/Female02_bin.js"
  binaryLoader.load(
    `${base_url}/models/obj/female02/Female02_bin.js`,
    function (geometry) {
            createMesh(geometry, scene, 4.05, -1000, -350, 0, 0xffdd44, true);
            createMesh(geometry, scene, 4.05, 0, -350, 0, 0xff5522, true);
            createMesh(geometry, scene, 4.05, 100, -350, 400, 0xff4422, true);
            createMesh(geometry, scene, 4.05, 250, -350, 2050, 0xff0044, true);
    }
  );

  // 加载男人模型
  // "../../static/models/obj/male02/Male02_bin.js"
  binaryLoader.load(
    `${base_url}/models/obj/male02/Male02_bin.js`,
    function (geometry) {
      createMesh(geometry, scene, 4.05, -500, -350, 600, 0xff7744, true);
      createMesh(geometry, scene, 4.05, 500, -350, 0, 0xff5522, true);
      createMesh(geometry, scene, 4.05, -250, -350, 1000, 0xff7744, true);
      createMesh(geometry, scene, 4.05, -250, -350, -350, 0xff9944, true);
    }
  );

  var planeGeometry = new THREE.PlaneGeometry(15000, 15000, 64, 64);
  var pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 30 });
  var grid = new THREE.Points(planeGeometry, pointsMaterial);
  grid.rotation.x = Math.PI / 2;
  grid.position.y = -400;
  // scene.add(grid)
  parent.add(grid);
}

/**
 * 创建mesh
 * @param {*} originalGeometry 从模型中加载的几何体
 * @param {*} scene 场景
 * @param {*} scale 模型缩放
 * @param {*} x 表示把模型放到什么位置
 * @param {*} y 
 * @param {*} z 
 * @param {*} color 粒子颜色
 * @param {*} dynamic 粒子是否运动起来
 */
function createMesh(originalGeometry, scene, scale, x, y, z, color, dynamic) {
  let mesh;
  // 获取顶点位置
  var vertices = originalGeometry.vertices;
  var vl = vertices.length; // 顶点数量
  // 几何体对象和相关属性
  var geometry = new THREE.Geometry();
  var vertices_tmp = []; //缓存数组 x,y,z,down,up
  // 把原Geometry的顶点复制到新的geometry中
  for (var i = 0; i < vl; i++) {
    p = vertices[i];
    geometry.vertices[i] = p.clone();
    vertices_tmp[i] = [p.x, p.y, p.z, 0, 0];
  }
  // 人的位置
  var clones = [
    [2000, 0, -2000],
    [2000, 0, 0],
    [1000, 0, 500],
    [1000, 0, -5000],
    [3000, 0, 2000],
    [-4000, 0, 1000],
    [-4500, 0, -3000],
    [0, 0, 0], // 原点位置的人设置自定义颜色
  ];

  // 判断模型是动态的还是静态的,生成粒子系统
  if (dynamic) {
    // 动态的物体
    for (var i = 0; i < clones.length; i++) {
      // 当i不是最后一个点位时，赋值默认颜色0x252525,最后一个点位给传入的颜色
      var c = i < clones.length - 1 ? 0x656565 : color;
      mesh = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color: c, size: 3 })
      );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
      // 给物体不同的点位，传入的点位+默认的点位
      mesh.position.x = x + clones[i][0];
      mesh.position.y = y + clones[i][1];
      mesh.position.z = z + clones[i][2];
      parent.add(mesh);
    }
  } else {
    // 静态的物体
    mesh = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color, size: 3 })
    );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    parent.add(mesh);
  }
  // 将所有的对象管理起来，设置一些初始化参数
  meshes.push({
    mesh, // 物体
    vertices: geometry.vertices,// 顶点
    vertices_tmp, // 顶点缓存
    vl, // 顶点数组长度
    down: 0, // 向下顶点数
    up: 0, // 向上顶点数
    direction: 0, // 向上/向下运动 -1向下 1向上
    speed: 60, // 运动速度
    started: false, // 是否开始运动
    start: Math.floor(100 + 200 * Math.random()), // 开始时间
    delay: Math.floor(200 + 200 * Math.random()), //停留时间
    dynamic, // 物体是否运动
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
