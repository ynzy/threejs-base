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
    renderer.setClearColor(0xffffff, 1.0);
}
var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    // 表示对象局部位置的Vector3。默认值为(0, 0, 0)。
    camera.position.x = 0;
    camera.position.y = 1000;
    camera.position.z = 0;
    // up 这个属性由lookAt方法所使用，例如，来决定结果的朝向。
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    // 旋转物体使其在世界空间中面朝一个点。
    // 这一方法不支持其父级被旋转过或者被位移过的物体。
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0,
    });
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
    // 创建几何体
    var geometry = new THREE.Geometry();
    //   创建线的材质
    // 不使用顶点的颜色就会使用color的颜色
    var material = new THREE.LineBasicMaterial({
        vertexColors: true,
    });
    //   定义颜色
    var color1 = new THREE.Color(0x444444),
        color2 = new THREE.Color(0xff0000),
        color3 = new THREE.Color(0x00ff00)

    // 线的材质可以由2点的颜色决定
    var p1 = new THREE.Vector3(-100, 0, 100);
    var p2 = new THREE.Vector3(100, 0, -100);
    var p3 = new THREE.Vector3(100, 0, 100);
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    geometry.vertices.push(p3);
    geometry.vertices.push(p1);

    geometry.colors.push(color1, color2, color3, color1);
    //   创建线
    var line = new THREE.Line(geometry, material, THREE.LineStrip);
    scene.add(line);
}
function render() {
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    render();
}

window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});