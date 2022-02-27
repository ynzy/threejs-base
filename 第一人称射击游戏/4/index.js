
const base_url = "https://threejs-models.vercel.app";
var container, stats;
var camera, scene, renderer;
var mesh, meshFloor;

const near = 0.1;
const far = 1000;
const aspect = window.innerWidth / window.innerHeight;

// init函数
function init() {
    // 视图容器
    container = document.createElement("div");
    document.body.appendChild(container);
    // 场景
    scene = new THREE.Scene();
    // 摄像机
    camera = new THREE.PerspectiveCamera(90, aspect, near, far)
    camera.position.set(0, 1.8, -5);
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    // 添加立方体网格
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1)
        , new THREE.MeshBasicMaterial({
            color: 0xFF0000, wireframe: true
        }));
    scene.add(mesh);
    // 地板
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 10, 1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            // side: THREE.DoubleSide
        })
    )
    // 向x负方向旋转90度
    meshFloor.rotation.x -= Math.PI / 2
    scene.add(meshFloor);

    // 渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement)

    animate()
}
// 帧循环函数
function animate() {
    // cpu空闲的时候才会执行这行，renderer.render还没执行的时候cpu是没有空闲的，所以第一次不会执行
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.05
    mesh.rotation.y += 0.05
    renderer.render(scene, camera);
}
// 启动函数
window.onload = init;