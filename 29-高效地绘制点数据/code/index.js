// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var controls, stats;

var camera, scene, renderer;

var light;

var param;

const clearColor = 0x000000; // 0xFFFFFF

const near = 1;
const far = 3500;

function initCamera() {
    camera = new THREE.PerspectiveCamera(27, width / height, near, far);
    camera.position.z = 2750;
    scene.add(camera);
}

function initLight() {
    scene.add(new THREE.AmbientLight(0x444444));
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(0, -1, 0);
    scene.add(light2);
}

function initGUI() {
    var ParamObj = function () {
        this.repeat = 4;
        this.wrap = 1000;
    };
    param = new ParamObj();
    const gui = new dat.GUI();
    // gui.add(param, "repeat", -100, 100).name('纹理重复')
    // gui.add(param, "wrap", 1000, 1002).name('纹理环绕').step(1)
}

// 初始化物体
function initObject() {
    // 点
    var particles = 50 * 10000;

    var geometry = new THREE.BufferGeometry();
    // 生成160万个三角形所需顶点的存储空间，一个三角形有三个顶点，一个顶点有xyz三个变量
    var positions = new Float32Array(particles * 3);

    // 每个顶点一种颜色
    var colors = new Float32Array(particles * 3);

    var color = new THREE.Color();

    var n = 800, n2 = n / 2; // 限定点出现的范围是[-400,400]这么一个立方体中，n2表示直径的一半

    for (var i = 0; i < positions.length; i += 9) {
        // 通过随机数生成点的位置

        // 生成一个顶点,范围是[-400,400]
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;

        // 随机生成点
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // 为每个顶点赋值颜色
        // x / n得到范围[-0.5,0.5],加0.5得到[0,1]范围的颜色
        var vx = (x / n) + 0.5
        var vy = (y / n) + 0.5
        var vz = (z / n) + 0.5

        color.setRGB(vx, vy, vz)

        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b

    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    // 计算几何体的包围盒
    geometry.computeBoundingSphere();
    // 创建点材质
    var material = new THREE.PointsMaterial({
        size: 10,
        vertexColors: THREE.VertexColors
    })

    // 创建点
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

/* 数据更新 */
function update() {
    var time = Date.now() * 0.001;
    particleSystem.rotation.x = time * 0.25
    particleSystem.rotation.y = time * 0.5
}

// 颜色选择器
window.colorPickerUpdate = function (picker, selector) {
    const hex = "0x" + picker.toHEXString().replace(/#/, "");
    light.color.setHex(hex);
};

/* --------------- 不需要经常修改的部分 --------------------- */

function animation() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
    stats.update();
    controls.update();
    update();
}

function threeStart() {
    // 初始化场景
    initScene();
    // 初始化渲染器
    initRenderer();
    // 初始化相机
    initCamera();
    // 初始化灯光
    initLight();
    // 初始化物体
    initObject();

    // 初始化布控球
    initControls();
    // 初始化GUI界面
    initGUI();
    // 初始化性能监控
    initStats();
    // 初始化颜色选择器
    // initColorPicker();

    // 渲染循环
    animation();
    /* 监听事件 */
    window.addEventListener("resize", onWindowResize, false);
}

function initRenderer() {
    width = document.getElementById("canvas-frame").clientWidth;
    height = document.getElementById("canvas-frame").clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: false,
    });
    renderer.setSize(width, height);
    document.getElementById("canvas-frame").appendChild(renderer.domElement);
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio)

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
}

function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 2000, 3500);
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

function initColorPicker() {
    const colorPicker = document.createElement("div");
    colorPicker.id = "color-picker";
    document.body.appendChild(colorPicker);
    const html = `<input
      data-jscolor="{value:'#FF0000', alpha:1}"
      onChange="colorPickerUpdate(this.jscolor, '#pr3')"
    />`;
    const colorPickerDom = document.querySelector("#color-picker");
    colorPickerDom.innerHTML = html;

    jscolor.install(colorPickerDom);

    jscolor.presets.default = {
        width: 141, // make the picker a little narrower
        position: "top", // position it to the right of the target
        previewPosition: "right", // display color preview on the right
        previewSize: 40, // make the color preview bigger
        format: "hex",
        previewSize: 40,
        closeButton: true,
        closeText: "关闭",
        palette: [
            "#000000",
            "#7d7d7d",
            "#870014",
            "#ec1c23",
            "#ff7e26",
            "#fef100",
            "#22b14b",
            "#00a1e7",
            "#3f47cc",
            "#a349a4",
            "#ffffff",
            "#c3c3c3",
            "#b87957",
            "#feaec9",
            "#ffc80d",
            "#eee3af",
            "#b5e61d",
            "#99d9ea",
            "#7092be",
            "#c8bfe7",
        ],
    };
}

function initControls() {
    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 0.2; // 旋转速度
    controls.zoomSpeed = 0.2; // 缩放速度
    controls.panSpeed = 0.1; // 平controls
    controls.staticMoving = false; // 静止移动，为 true 则没有惯性
    controls.dynamicDampingFactor = 0.2; // 阻尼系数 越小 则滑动越大

    controls.minDistance = near; // 最小视角
    controls.maxDistance = far; // 最大视角 Infinity 无穷大
}

/* 窗口变动触发 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});