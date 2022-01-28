let width, height;
let scene, camera, renderer, controls, guiControls;
let param; // gui参数
let light; // 灯实例
let lightPos; // 灯光位置
let cube; // 几何体
let texture; // 纹理
function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0); // 0xFFFFFF
}

const near = 1;
const far = 1000
function initCamera() {
    camera = new THREE.PerspectiveCamera(70, width / height, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

function initScene() {
    scene = new THREE.Scene();
}



function initLight() {
    light = new THREE.DirectionalLight(0xff0000, 1, 0, 0)
    light.position.set(100, 100, 200)
    scene.add(light)
}
var geometry
function initObject() {
    // 创建一个平面几何体
    geometry = new THREE.PlaneGeometry(300, 300, 2, 3)
    // 材质颜色取顶点的颜色
    let material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: false, // 将几何体渲染为线框
        // color: 0xff0000
    })
    // 定义三种颜色
    var color1 = new THREE.Color(0x00900f)
    var color2 = new THREE.Color(0x0000f0)
    var color3 = new THREE.Color(0x20f0ff)

    for (var i = 0; i < geometry.faces.length; i++) {
        var f = geometry.faces[i]
        f.vertexColors[0] = color1
        f.vertexColors[1] = color2
        f.vertexColors[2] = color3
    }

    let object = new THREE.Mesh(geometry, material)
    scene.add(object)
}


function createGUI() {
    var ParamObj = function () {
        this.repeat = 4;
        this.wrap = 1000;
    }
    param = new ParamObj();
    const gui = new dat.GUI();
    // gui.add(param, "repeat", -100, 100).name('纹理重复')
    // gui.add(param, "wrap", 1000, 1002).name('纹理环绕').step(1)
}

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

/* 数据更新 */
function update() {
    // stats.update();
    controls.update();
}
/* 窗口变动触发 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animation() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
    update()
}

jscolor.presets.default = {
    width: 141,               // make the picker a little narrower
    position: 'top',        // position it to the right of the target
    previewPosition: 'right', // display color preview on the right
    previewSize: 40,          // make the color preview bigger
    format: 'hex',
    previewSize: 40,
    closeButton: true,
    closeText: '关闭',
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
};
function colorPickerUpdate(picker, selector) {
    const hex = '0x' + picker.toHEXString().replace(/#/, '')
    light.color.setHex(hex)
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initControls();
    initObject();
    createGUI()
    animation();
    /* 监听事件 */
    window.addEventListener('resize', onWindowResize, false);
}

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});



