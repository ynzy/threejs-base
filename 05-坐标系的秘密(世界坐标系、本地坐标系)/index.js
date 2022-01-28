var width, height;
var renderer;
function initThree() {
    width = document.getElementById("canvas-frame").clientWidth;
    height = document.getElementById("canvas-frame").clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否开启反锯齿，设置为true开启反锯齿，可以提升画质
    });
    renderer.setSize(width, height);
    document.getElementById("canvas-frame").appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 1.0);
}
var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    // 表示对象局部位置的Vector3。默认值为(0, 0, 0)。
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;
}
var scene;
function initScene() {
    scene = new THREE.Scene();
}
var light;
function initLight() {
    // 定义平行光
    light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
    // 设置平行光位置
    light.position.set(100, 100, 200);
    //   将平行光添加到场景
    scene.add(light);
}


var cube;
function initObject() {
    // 6. 定义几何体
    // 宽度，高度，深度，后面不设置默认为 1
    // width, height, depth, widthSegments, heightSegments, depthSegments
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    // 7. 定义材质
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // 8. 定义网格， 几何体和材质组成网格
    cube = new THREE.Mesh(geometry, material);
    // 9. 将网格模型添加到场景中
    // scene.add(cube);
}
//  定义辅助坐标
var axisHelper
function initAxisHelper() {
    axisHelper = new THREE.AxisHelper(4) //
    // scene.add(axisHelper)
}
// 初始化一个三维物体，并添加子物体和辅助坐标
var objectTotal
function initObjectTotal() {
    objectTotal = new THREE.Object3D()
    objectTotal.add(cube)
    objectTotal.add(axisHelper)
    scene.add(objectTotal)
}

function render() {
    renderer.clear();
    objectTotal.rotation.y += 0.01;
    // axisHelper.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
function threeStart() {
    initThree();
    initCamera();
    initScene();
    initObject();
    initAxisHelper();
    initObjectTotal()
    initLight();
    render();
}

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});