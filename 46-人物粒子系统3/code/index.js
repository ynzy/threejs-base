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
  camera.position.set(0, 700, 7000)
  camera.lookAt(scene.position)
}

var jsonLoader, binaryLoader;
var parent, mesh;
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
    // scene.add(mesh);
  });

  // 加载车模型
  binaryLoader.load(
    "../../static/models/binary/veyron/VeyronNoUv_bin.js",
    function (geometry) {
      createMesh(geometry, scene, 6.8, 2200, -200, -100, 0x0055ff, false);
    }
  );


  // 加载女人模型
  binaryLoader.load(
    "../../static/models/obj/female02/Female02_bin.js",
    function (geometry) {
      createMesh(geometry, scene, 4.05, -1000, -350, 0, 0xffdd44, true);
      createMesh(geometry, scene, 4.05, 0, -350, 0, 0xff5522, true);
      createMesh(geometry, scene, 4.05, 100, -350, 400, 0xff4422, true);
      createMesh(geometry, scene, 4.05, 250, -350, 2050, 0xff0044, true);
    }
  );


  // 加载男人模型
  binaryLoader.load(
    "../../static/models/obj/male02/Male02_bin.js",
    function (geometry) {
      createMesh(geometry, scene, 4.05, -500, -350, 600, 0xff7744, true);
      createMesh(geometry, scene, 4.05, 500, -350, 0, 0xff5522, true);
      createMesh(geometry, scene, 4.05, -250, -350, 1000, 0xff7744, true);
      createMesh(geometry, scene, 4.05, -250, -350, -350, 0xff9944, true);
    }
  );

  parent = new THREE.Object3D();
  scene.add(parent);

  var grid = new THREE.Points(new THREE.PlaneBufferGeometry(15000, 15000, 64, 64), new THREE.PointsMaterial({
    color: 0xff0000, size: 30,
  }))
  grid.position.y = -400;
  grid.rotation.x = - Math.PI / 2
  parent.add(grid)
}


var cloneMeshes = [];
var meshes = [];

/**
 * 创建mesh
 * @param {*} originalGeometry 从模型中加载的几何体
 * @param {*} scene 场景
 * @param {*} scale 模型缩放
 * @param {*} x 表示把模型放到什么位置
 * @param {*} y 
 * @param {*} z 
 * @param {*} color 模型颜色
 * @param {*} dynamic 粒子是否运动起来
 */
function createMesh(originalGeometry, scene, scale, x, y, z, color, dynamic) {
  // 获取顶点位置
  var vertices = originalGeometry.vertices
  var vl = vertices.length;  // 顶点数量
  // 几何体对象和相关属性
  var geometry = new THREE.Geometry()
  var vertices_tmp = [] //缓存数组 x,y,z,down,up

  // 把原Geometry的顶点复制到新的geometry中
  for (var i = 0; i < vl; i++) {
    p = vertices[i]
    geometry.vertices[i] = p.clone()
    vertices_tmp[i] = [p.x, p.y, p.z, 0, 0]
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
    [0, 0, 0],
  ];

  // 模型上到下，或者下到上，静态的物体，动态的物体，生成points
  if (dynamic) {
    for (var i = 0; i < clones.length; i++) {
      // 当i不是最后一个点位时，赋值默认颜色0x252525
      c = i < clones.length - 1 ? 0x656565 : color;
      mesh = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color: c, size: 3 })
      );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

      mesh.position.x = x + clones[i][0];
      mesh.position.y = y + clones[i][1];
      mesh.position.z = z + clones[i][2];
      parent.add(mesh);
      // 将所有的对象管理起来，放到数组里面
      cloneMeshes.push({ mesh, speed: 0.5 + Math.random() });
    }
  } else {
    mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 3, }));
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale
    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z
    parent.add(mesh)
  }
  // 设置一些初始化参数,方向
  meshes.push({
    mesh,
    vertices: geometry.vertices,
    vertices_tmp,
    vl,
    down: 0, // 向下顶点数
    up: 0, // 向上顶点数
    direction: 0,
    speed: 60, // 运动速度
    delay: Math.floor(200 + 200 * Math.random()), //停留时间
    started: false,
    start: Math.floor(100 + 200 * Math.random()), // 开始时间
    dynamic,
  });

  // 将所有的对象管理起来，
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

var clock = new THREE.Clock()

var j, jl, cm, data, vertices, vertices_tmp, vl, d, vt;
var p;
var delta;
function render() {
  // 计算每一帧时间
  delta = clock.getDelta()
  // 如果每一帧度过时间大于2微秒，就设置为2，保证每一帧时间都在2微秒以内
  delta = delta < 2 ? delta : 2;
  parent.rotation.y += -0.02 * delta;

  // 根据动态或者静态模型调整，每个模型的顶点位置
  for (var j = 0; j < meshes.length; j++) {
    data = meshes[j]
    mesh = data.mesh

    vertices = data.vertices
    vertices_tmp= data.vertices_tmp
    vl = data.vl

    // 如果是静态模型，跳过
    if(!data.dynamic) {
      continue;
    }
    //! 最开始的时候，没有移动，设置移动，向下
    if(data.start > 0) {
      data.start -= 1
    }else {
      // 开始动画
      if(!data.started) {
        data.direction = -1;
        data.started = true
      }
    }
    //! 然后设置粒子是向下还是向上移动

    for (let i = 0; i < vl; i++) {
      p = vertices[i];
      vt = vertices_tmp[i];
      // 向下
      if (data.direction < 0) {
        if (p.y > 0) {
          p.x += 1.5 * (0.5 - Math.random()) * data.speed * delta;
          // 向下的概率明显大于向上的概率，所有整个人物粒子总有一个时刻是向下的
          p.y += 3.0 * (0.15 - Math.random()) * data.speed * delta;
          p.z += 1.5 * (0.5 - Math.random()) * data.speed * delta;
        } else {
          // 0表示向下
          if (!vt[3]) {
            vt[3] = 1;
            data.down += 1;
          }
        }
      }

      // 向上
      if (data.direction > 0) {
        // 计算落地点到原始位置的距离
        d = Math.abs(p.x - vt[0]) + Math.abs(p.y - vt[1]) + Math.abs(p.z - vt[2]);
        if (d > 1) {
          // 越来越向vt[0]靠近
          p.x += -(p.x - vt[0]) / d * data.speed * delta * (0.85 - Math.random());
          p.y += -(p.y - vt[1]) / d * data.speed * delta * (1 - Math.random());
          p.z += -(p.z - vt[2]) / d * data.speed * delta * (0.85 - Math.random());
        } else {
          // 表示向上
          if (!vt[4]) {
            vt[4] = 1;
            data.up += 1;
          }
        }
      }
    }

    //! 如果是向下移动完成，那么休息一会，再向上移动
    // 如果向下的顶点数等于总顶点数，就可以向上移动了
    if (data.down === vl) {
      if (data.delay === 0) {
        data.direction = 1;
        data.speed = 10;
        data.down = 0;
        data.delay = 300;

        for (let i = 0; i < vl; i++) {
          vertices_tmp[i][3] = 0;
        }
      } else {
        data.delay -= 1;
      }
    }

    //! 如果是向上移动完成，那么休息一会，再向下移动
    if (data.up === vl) {
      if (data.delay === 0) {
        data.direction = -1;
        data.speed = 10;
        data.up = 0;
        data.delay = 300;

        for (let i = 0; i < vl; i++) {
          vertices_tmp[i][4] = 0;
        }
      } else {
        data.delay -= 1;
      }
    }

    mesh.geometry.verticesNeedUpdate = true;
  }

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
