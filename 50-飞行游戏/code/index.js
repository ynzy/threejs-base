// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();
const base_url = "https://threejs-models.vercel.app";


window.addEventListener("load", function (event) {
  console.log("文档以及它包含的资源都已加载完成");
  main()
});

// 入口函数
function main() {
  GAME.init()
}

const MAPS = (function () {
  var maps = []
  maps[0] = {
    // 地图数据
    mapString: `\
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 70 30 10 00 00 10 30 70 F0 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 70 30 10 00 00 10 30 70 F0 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 00 00 00 00 00 00 00 00 0F FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 F0 00 00 F3 00 FF \
        FF 00 00 00 00 00 00 00 00 FF 00 FF \
        FF 00 0F 00 00 F1 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 FF 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 FF 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 FF 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 FF 00 00 FF \
        FF 00 00 00 FF 00 FF 00 00 00 00 FF \
        FF 00 00 00 00 00 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 FF FF FF FF FF FF \
        FF 00 00 00 00 FF 00 00 00 00 00 FF \
        FF 00 00 00 FF 00 FF FF FF FF FF FF \
        FF FF FF AA FF 00 00 FF FF FF FF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF FF FF AA AA FF FF FF FF FF FF FF \
        FF FF FF 00 00 00 00 FF FF FF FF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 32 00 EA EA EF EF FF FF A8 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 FF 00 00 00 00 FF \
        FF FF FF FF 0F 0F 0F FF FF FF FF 00 \
        FF 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 87 00 00 44 00 A0 00 00 00 \
        FF FF FF 00 00 00 B3 FF FF 00 00 00 \
        FF FF FF 00 00 0A FF FF FF 00 00 00 \
        00 FF FF 00 FF FF 00 FF FF FF 0F F0 \
        00 00 0F 00 00 F0 00 FF FF FF FF 00 \
        FF 00 FF 00 FF 00 00 FF FF 00 00 00 \
        00 FF FF 18 FA 00 00 32 56 87 95 00 \
        00 FF FF 3C FA 0F FF 32 56 87 00 00 \
        00 FF FF 7E FA 0F FF 32 56 87 00 00 \
        00 FF FF 8E FA 0F FF 32 56 87 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF AA 55 AA 55 AA 55 AA 55 AA 55 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 55 AA 55 AA 55 AA 55 AA 55 AA FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF AA 55 AA 55 AA 55 AA 55 AA 55 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 55 AA 55 AA 55 AA 55 AA 55 AA FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 FF FF 00 00 00 00 FF \
        FF 00 00 00 FF 00 00 FF 00 00 00 FF \
        FF 00 00 FF 00 00 00 00 FF 00 00 FF \
        FF 00 FF 00 00 FF FF 00 00 FF 00 FF \
        FF 00 F0 00 00 FF FF 00 00 F0 00 FF \
        FF 00 F0 00 00 FF FF 00 00 F0 00 FF \
        FF 00 F0 00 00 00 00 00 00 F0 00 FF \
        FF 00 F0 00 00 00 00 00 00 F0 00 FF \
        00 FF FF 00 00 00 00 00 00 FF FF FF \
        00 00 FF 00 00 00 00 00 00 00 FF 00 \
        00 FF 00 00 00 00 00 00 00 00 FF 00 \
        00 00 00 00 00 10 10 10 00 00 FF 00 \
        FF 00 00 00 00 10 00 10 00 00 00 FF \
        FF 00 00 00 00 10 10 10 00 00 00 FF \
        FF 00 10 00 00 00 00 00 00 00 00 FF \
        FF 10 F0 10 00 00 00 00 00 00 00 FF \
        FF F0 F1 F0 10 00 00 00 00 00 00 FF \
        FF F1 F3 F1 F0 00 00 00 00 00 00 FF \
        FF F3 FF F3 F1 00 00 00 00 00 00 FF \
        FF FF FF 00 FF F0 FF F0 FF F0 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 FF AA A4 FF A4 33 33 00 00 FF \
        FF 00 00 00 FF 00 A4 33 33 00 00 FF \
        FF 00 00 00 00 00 A4 00 00 00 00 FF \
        FF 00 00 00 00 00 A4 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF DF DF DF DF DF DF DF DF DF DF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 08 FF 08 FF 08 FF 08 FF 08 FF FF \
        FF 08 08 08 08 08 08 08 08 08 00 FF \
        FF 0F 00 0F 00 0F 00 0F 00 0F 00 FF \
        FF 8F 00 8F 00 8F 00 8F 00 8F 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF FB FB FB FB FB FB FB FB FB FB FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF E7 C3 81 81 81 81 81 81 C3 E7 FF \
        FF FF E7 C3 C3 C3 C3 C3 C3 E7 FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF FF E7 E7 E7 E7 FF FF FF FF \
        FF FF FF FF E7 FF FF E7 FF FF FF FF \
        FF FF FF FF E7 FF FF E7 FF FF FF FF \
        FF 81 81 A5 A5 BD BD A5 A5 81 81 FF \
        FF 81 81 A5 A5 BD BD A5 A5 81 81 FF \
        FF 81 81 87 85 9D 9D 85 87 81 81 FF \
        FF 81 81 DF 85 C5 C5 85 DF 81 81 FF \
        FF 85 85 C5 9D C5 DD 85 C5 85 87 FF \
        FF 85 85 C5 01 01 01 01 C5 85 87 FF \
        FF 8D C5 01 01 01 01 01 01 C5 8F FF \
        FF CD 01 01 00 00 00 01 01 01 CD FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF EE BB 80 BB EE 03 DE 73 3D E7 FF \
        FF EF BB 89 BB FF 63 FF 73 3D EF FF \
        FF C5 B5 89 BB C7 03 FF 43 05 FF FF \
        FF 45 01 01 0F 07 03 FF 03 05 0F FF \
        FF 00 00 00 00 00 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 06 42 7E 40 00 72 52 5E 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        `,
    // 每一个元素占多少字节
    charsPerElement: 2
  };

  return {

  }
})()

// 游戏类
const GAME = (function () {
  const show = function (id) {
    const dom = document.getElementById(id)
    dom.style.display = "block"
  }
  const hide = function (id) {
    const dom = document.getElementById(id)
    dom.style.display = "none"
  }
  return {
    running: false, // 游戏状态
    // 玩家输了比赛
    // 玩家赢了比赛

    // 玩家第一次开始比赛
    start: function () {
      hide('start')
      this.running = true
      // 播放音乐

    },
    // 重新开始比赛
    restart: function () {

    },
    // 初始化
    init: function () {
      // 显示开始界面
      show('start')
      // 初始化游戏和游戏引擎(three.js)
      if (!initEngine()) {
        animate()
      }
      // 设置关卡

      // 设置键盘操控类
    }
  }
})()

// 初始化游戏引擎
function initEngine() {
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
  // 加载天空盒
  initSkyBox();
  // 加载模型
  initObject();
  // // 初始化地图
  // initMap()
}

var container;
// 视图
function initView() {
  container = document.createElement("div");
  document.body.appendChild(container);
}

var renderer;
// 渲染器
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setClearColorHex(0xbbbbbb, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true
  renderer.shadowMapSoft = true
  container.appendChild(renderer.domElement);
}

var scene;
// 场景
function initScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000022, 10, 300);
}

const near = 1;
const far = 10000;
var camera;
// 摄像机
function initCamera() {
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(0, 0, 5)
  camera.updateMatrix()
  scene.add(camera)
}


var ambientLight, pointLight, spotLight, shadowLight;
// 灯光
function initLight() {
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xff6600, 1, 50);
  scene.add(pointLight);

  spotLight = new THREE.SpotLight(0xaaaaaa, 2, 0, Math.PI / 4, 1);
  spotLight.position.set(0, 0, -1);
  spotLight.castShadow = false;
  scene.add(spotLight);

  shadowLight = new THREE.DirectionalLight(0xaaaaaa, 4, 1);
  shadowLight.position.set(0, 0, -1);
  shadowLight.castShadow = true;
  shadowLight.onlyShadow = true;
  shadowLight.shadowCameraNear = 2;
  shadowLight.shadowCameraFar = 200;
  shadowLight.shadowCameraLeft = -10;
  shadowLight.shadowCameraRight = 10;
  shadowLight.shadowCameraTop = 10;
  shadowLight.shadowCameraBottom = -10;
  shadowLight.shadowCameraVisible = false;
  shadowLight.shadowBias = 0;
  shadowLight.shadowDarkness = 0.5;
  shadowLight.shadowMapWidth = 512;
  shadowLight.shadowMapHeight = 512;
  scene.add(shadowLight);
}

var skyboxMesh;
// 天空盒
function initSkyBox() {
  // 加载纹理
  var textureCube = THREE.ImageUtils.loadTextureCube(["images/skybox/posx.jpg", "images/skybox/negx.jpg", "images/skybox/posy.jpg", "images/skybox/negy.jpg", "images/skybox/posz.jpg", "images/skybox/negz.jpg"]);
  // 创建立方体着色器
  var shader = THREE.ShaderUtils.lib["cube"];
  //var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  shader.uniforms["tCube"].texture = textureCube;
  shader.uniforms["tFlip"].texture = -1;
  //uniforms['tCube'].texture= textureCube; // textureCube has been init before
  // 创建材质
  var cubeMaterial = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
  });
  cubeMaterial.overdraw = true;
  // 创建天空盒立方体
  skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), cubeMaterial);
  skyboxMesh.flipSided = true;
  skyboxMesh.castShadow = false;
  skyboxMesh.receiveShadow = false;

  scene.add(skyboxMesh);
}

var tux;
// 模型
function initObject() {
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load('tux.dae', function colladaReady(collada) {
    var tuxScene = collada.scene;
    skin = collada.skins[0];

    tuxScene.scale.x = tuxScene.scale.y = tuxScene.scale.z = 1;
    tuxScene.updateMatrix();
    spotLight.target = tuxScene;
    shadowLight.target = tuxScene;
    tux = tuxScene;
    tux.children[0].castShadow = true;
    tux.children[0].receiveShadow = false;
    //camera.lookAt(tux);
    //camera.updateMatrix();
    scene.add(tux);
  });

}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera)
}
