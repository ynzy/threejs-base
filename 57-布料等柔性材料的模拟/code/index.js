const base_url = "https://threejs-models.vercel.app";
// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, camera, scene, renderer;

var light1,
  light2,
  particle,
  constraintIterations,
  time,
  sphere,
  sphereSize,
  geom;

var keyboard = new THREEx.KeyboardState();

var timestepsize = 0.6 * 0.6;
var damping = 0.01;
var constraintIterations = 15;
var windStrength = new THREE.Vector3(0, 0, 1);

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
  // 初始化dat.GUI
  initGUI();
  // 初始化性能监控
  initStats();
  // 初始化布控球
  initControls();
  // 渲染循环
  animate();
  // window.addEventListener("resize", onWindowResize, false);
  onWindowResize();
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
  var light = new THREE.PointLight(0xffffff);
  light.position = new THREE.Vector3(0.1, 4.0, 4.0);
  camera.add(light);

  var light2 = new THREE.PointLight(0xffffff);
  light2.position = new THREE.Vector3(0.1, 4.0, -4.0);
  scene.add(light2);
}

const near = 0.1;
const far = 20000;
const aspect = window.innerWidth / window.innerHeight;
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, aspect, near, far);
  camera.position.set(0, 0, 2);
  camera.lookAt(scene.position);
  scene.add(camera);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xf0f0f0, 1.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

var cloth;
var geom;
var color;
var clothMaterial;
// 初始化物体
function initObject() {
  // 生成顶点
  cloth = new Cloth();
  geom = new THREE.Geometry();
  geom.dynamic = true; // 表示geometry的每一帧点都会有变化
  // 将2500个点放到geometry中
  for (var i = 0; i < cloth.particles.length; i++) {
    geom.vertices.push(cloth.particles[i].position);
  }
  // 构造三角面
  for (var x = 0; x < cloth.w - 1; x++) {
    // 50
    for (var y = 0; y < cloth.h - 1; y++) {
      // 50
      if (x % 2 > 0) {
        // #FF0000
        color = new THREE.Color("red");
        console.log(color);
      } else {
        color = new THREE.Color("brown");
        console.log(color); 
      }
      geom.faces.push(
        new THREE.Face3(
          y * cloth.w + x + 1,
          y * cloth.w + x,
          (y + 1) * cloth.w + x
        )
      );
      geom.faces[geom.faces.length - 1].color = color;
      geom.faces.push(
        new THREE.Face3(
          (y + 1) * cloth.w + x + 1,
          y * cloth.w + x + 1,
          (y + 1) * cloth.w + x
        )
      );
      geom.faces[geom.faces.length - 1].color = color;
    }
  }

  geom.computeVertexNormals();
  clothMaterial = new THREE.MeshLambertMaterial({
    wireframe: false,
    vertexColors: true,
    side: THREE.DoubleSide,
  });
  var clothObject = new THREE.Mesh(geom, clothMaterial);
  clothObject.castShadow = true;
  clothObject.receiveShadow = true;
  scene.add(clothObject);

  // create the sphere
  sphereSize = 0.2;
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(sphereSize, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  sphere.position = new THREE.Vector3(0.6, 0.6, 0);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  scene.add(sphere);
}

// Particle
function Particle(vector) {
  this.movable = true; // 是否动
  this.position = vector; // 粒子的位置
  this.positionPrve = vector; // 粒子的上一个位置
  this.mass = 1; // 粒子重量/密度
  this.acc = new THREE.Vector3(0, 0, 0); // 粒子运动方向
}

Particle.prototype.addFace = function (vector) {
  this.acc = this.acc.add(vector.divideScalar(this.mass));
};

// Particle verlet integration
Particle.prototype.timeStep = function () {
  if (this.movable) {
    var temp = this.position.clone();
    var delta = new THREE.Vector3(0, 0, 0);
    delta.subVectors(temp, this.positionPrve);
    delta.multiplyScalar(1.0 - damping).add(this.position);
    delta.add(this.acc.multiplyScalar(timestepsize));
    this.positionPrve = temp;
    this.position = delta;
    this.acc.set(0, 0, 0);
  }
};

// Calculating normals for each face
function calcTriangleNormal(p1, p2, p3) {
  var v1 = new THREE.Vector3().subVectors(p2.position, p1.position);
  var v2 = new THREE.Vector3().subVectors(p3.position, p1.position);
  return v1.cross(v2);
}

// Cloth
function Cloth() {
  this.w = 50;
  this.h = 50;
  this.particles = [];
  this.particles.length = this.w * this.h; // 数组是2500的长度
  this.constraints = []; // 约束力

  // Create Particles
  for (var x = 0; x < this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      // 把2500个粒子放到粒子数组中
      this.particles[y * this.w + x] = new Particle(
        new THREE.Vector3(x / this.w, y / this.h, 0) // [0,0.02,0] [0.02,0.02,0]
      );
    }
  }
  // 构造点和点的约束力
  // Create constraints between particles
  for (var x = 0; x > this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      if (x < this.w - 1) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x + 1, y),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x + 1, y).position
            )
            .length(),
        ]);
      }
      if (y < this.h - 1) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x, y + 1),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x, y + 1).position
            )
            .length(),
        ]);
      }
      if (x < this.w - 1 && y < this.h - 1) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x + 1, y + 1),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x + 1, y + 1).position
            )
            .length(),
        ]);
      }
      if (x < this.w - 1 && y < this.h - 1) {
        this.constraints.push([
          this.getParticle(x + 1, y),
          this.getParticle(x, y + 1),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x + 1, y).position,
              this.getParticle(x, y + 1).position
            )
            .length(),
        ]);
      }
    }
  }

  // Connecting constraints between secondary neighbors in the grid
  for (var x = 0; x < this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      if (x < this.w - 2) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x + 2, y),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x + 2, y).position
            )
            .length(),
        ]);
      }
      if (y < this.h - 2) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x, y + 2),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x, y + 2).position
            )
            .length(),
        ]);
      }
      if (x < this.w - 2 && y < this.h - 2) {
        this.constraints.push([
          this.getParticle(x, y),
          this.getParticle(x + 2, y + 2),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x, y).position,
              this.getParticle(x + 2, y + 2).position
            )
            .length(),
        ]);
      }
      if (x < this.w - 2 && y < this.h - 2) {
        this.constraints.push([
          this.getParticle(x + 2, y),
          this.getParticle(x, y + 2),
          new THREE.Vector3()
            .subVectors(
              this.getParticle(x + 2, y).position,
              this.getParticle(x, y + 2).position
            )
            .length(),
        ]);
      }
    }
  }

  // 设置最上面一行的粒子是不可移动的
  // Making top particles unmovable
  for (var i = 0; i < this.w; i++) {
    this.getParticle(i, this.h - 1).movable = false;
  }
}

Cloth.prototype.addForce = function (v) {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].addFace(v);
  }
};

Cloth.prototype.getParticle = function (x, y) {
  return this.particles[y * this.w + x];
};

Cloth.prototype.addFace = function (v) {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].addForce(v);
  }
};

Cloth.prototype.addWindForceTriangle = function (p1, p2, p3, direction) {
  var normal = calcTriangleNormal(p1, p2, p3);
  var d = normal.normalize();
  var force = normal.multiplyScalar(d.dot(direction));
  p1.addFace(force);
  p2.addFace(force);
  p3.addFace(force);
};

Cloth.prototype.windForce = function (direction) {
  for (var x = 0; x < this.w - 1; x++) {
    for (var y = 0; y < this.h - 1; y++) {
      this.addWindForceTriangle(
        this.getParticle(x + 1, y),
        this.getParticle(x, y),
        this.getParticle(x, y + 1)
      );
      this.addWindForceTriangle(
        this.getParticle(x + 1, y + 1),
        this.getParticle(x + 1, y),
        this.getParticle(x, y + 1)
      );
    }
  }
};

Cloth.prototype.satisfyConstraint = function (constraint) {
  var distance = new THREE.Vector3(0, 0, 0);
  distance.subVectors(constraint[1].position, constraint[0].position);
  if (distance.length() === 0) {
    return;
  }
  var correctionVec = new THREE.Vector3(0, 0, 0);
  correctionVec = distance.multiplyScalar(
    1 - constraint[2] / distance.length()
  );
  if (constraint[0].movable) {
    constraint[0].position = constraint[0].position.add(
      correctionVec.multiplyScalar(0.5)
    );
  }
  if (constraint[1].movable) {
    constraint[1].position = constraint[1].position.sub(
      correctionVec.multiplyScalar(0.5)
    );
  }
};

function animate() {
  render();
  update();
  stats.update();
  controls.update();
  requestAnimationFrame(animate);
}

function render() {
  // Pass particles positions to cloth geometry
  for (var i = 0; i < cloth.particles.length; i++) {
    geom.vertices[i] = cloth.particles[i].position;
  }
  geom.computeFaceNormals();
  geom.verticesNeedUpdate = true;
  geom.normalsNeedUpdate = true;
  renderer.render(scene, camera);
}

function update() {
  var forceVector = new THREE.Vector3(0, -0.2, 0);
  console.log("timestepsize:" + timestepsize);
  sphere.position.setZ(Math.sin(Date.now() / 1000));
}

var gui;
function initGUI() {
  gui = new dat.GUI();
  var f1 = gui.addFolder("Cloth Model");
  f1.add(clothMaterial, "wireframe");
  var f2 = gui.addFolder("Wind Strength");
  f2.add(windStrength, "x", -10, 10);
  f2.add(windStrength, "y", -10, 10);
  f2.add(windStrength, "z", -10, 10);
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
  THREEx.WindowResize(renderer.camera);
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
}
