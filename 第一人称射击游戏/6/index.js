
const base_url = "https://threejs-models.vercel.app";
var container, stats;
var camera, scene, renderer;
var mesh, meshFloor;
var ambientLight, light;

const near = 0.1;
const far = 1000;
const aspect = window.innerWidth / window.innerHeight;

var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

// 是否开启线框
const USE_WIREFRAME = false;
// init函数
function init() {
    /* 视图容器 */
    container = document.createElement("div");
    document.body.appendChild(container);
    /* 场景 */
    scene = new THREE.Scene();

    /* 灯光  */
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6, -3);
    light.castShadow = true; // 产生阴影
    // 产生阴影的距离
    // Will not light anything closer than 0.1 units or further than 25 units
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    /* 摄像机 */
    camera = new THREE.PerspectiveCamera(90, aspect, near, far)
    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    /* 物体 */
    // 添加立方体网格
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1)
        , new THREE.MeshBasicMaterial({
            color: 0xff4444,
            wireframe: USE_WIREFRAME
        }));
    mesh.castShadow = true; // 产生阴影
    mesh.position.y += 1;
    scene.add(mesh);
    // 地板
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: USE_WIREFRAME
            // side: THREE.DoubleSide
        })
    )
    // 向x负方向旋转90度
    meshFloor.rotation.x -= Math.PI / 2
    meshFloor.receiveShadow = true; // 接收阴影
    scene.add(meshFloor);

    /* 渲染器 */
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 渲染器开启阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement)

    animate()
}
// 帧循环函数
function animate() {
    // cpu空闲的时候才会执行这行，renderer.render还没执行的时候cpu是没有空闲的，所以第一次不会执行
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}

// 启动函数
window.onload = init;