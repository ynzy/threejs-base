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
    // 初始化场景
    initScene();
    // 初始化灯光
    initLight();
    // 初始化相机
    initCamera();
    // 初始化物体
    initObject();
    // 初始化渲染器
    initRenderer();
    // 初始化性能监控
    initStats();
    // 渲染循环
    animate();
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);
}


var fullWidth = 550;
var fullHeight = 600;

function initView() {
    container = document.createElement("div");
    document.body.appendChild(container);

}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    // 平行光
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
}

const near = 1
const far = 10000

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
}


// 初始化物体
function initObject() {
    // 盒子
    var geometry = new THREE.BoxGeometry(20, 20, 20);

    // 创建2000个随机物体
    for (var i = 0; i < 2000; i++) {
        // 创建材质，材质颜色是随机的
        var material = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff,
        });

        var object = new THREE.Mesh(geometry, material);
        // 随机位置
        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;
        // 随机旋转
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        // 随机大小
        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        scene.add(object);
    }
}

// 如果只使用一个渲染器，四个容器中添加这个渲染器，那么会造成只有最后一个容器添加了这个渲染器
function initRenderer() {
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    container.appendChild(renderer.domElement);
}

function animate() {
    render();
    stats.update();
    requestAnimationFrame(animate);
}


function render() {
    theta += 0.1;

    // 摄像机围绕一个球进行旋转
    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
    camera.lookAt(scene.position);
    // 更新相机矩阵
    camera.updateMatrixWorld();

    // find intersections
    // 计算 raycaster 中需要的 origin、direction参数
    // 计算出 相机照射到鼠标的光线
    raycaster.setFromCamera(mouse, camera);

    // 找到 和光线相交的对象，返回数组
    var intersects = raycaster.intersectObjects(scene.children);

    // 如果有相交的物体
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            // 这里选中的物体是上一个选中物体。
            if (INTERSECTED) {
                // 把上一个选中的物体设置为当前色。
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            }
            // 设置当前选中的物体
            INTERSECTED = intersects[0].object;
            // 保留当前选中物体，**原本的颜色**
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // 设置当前选中的物体颜色为红色
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
        // 如果没有相交的物体，把选中的物体设置为原来的颜色
    } else {
        if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
        // 清空选中物体
        INTERSECTED = null;

    }
    renderer.render(scene, camera);
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

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}