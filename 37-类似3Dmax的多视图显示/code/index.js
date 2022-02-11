// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var scene, renderer;

var container1, container2, container3, container4
var renderer1, renderer2, renderer3, renderer4

var light;
var mesh, group1, group2, group3;


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
    // 绘制阴影面
    createShadowByCanvas();
    // 初始化阴影平面
    initShadowPlane();

    // 初始化物体
    initObject();
    // 初始化性能监控
    initStats();
    // 渲染循环
    animation();

    document.addEventListener("mousemove", onDocumentMouseMove, false);
}


var fullWidth = 550;
var fullHeight = 600;

function initView() {
    container1 = document.getElementById("container1");
    container2 = document.getElementById("container2");
    container3 = document.getElementById("container3");
    container4 = document.getElementById("container4");

}

function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);
}

const near = 1
const far = 10000

function initCamera() {
    camera1 = new THREE.PerspectiveCamera(45, 500 / 250, near, far);
    camera1.setViewOffset(500, 250, 0, 0, 500, 250)
    camera1.position.z = 1800 // z轴看向原点，正对屏幕
    
    camera2 = new THREE.PerspectiveCamera(45, 500 / 250, near, far);
    camera2.setViewOffset(500, 250, 0, 0, 500, 250)
    camera2.position.x = 1800 // x轴看向原点，从球的侧面往左看

    camera3 = new THREE.PerspectiveCamera(45, 500 / 250, near, far);
    camera3.setViewOffset(500, 250, 0, 0, 500, 250)
    // camera3 = new THREE.OrthographicCamera(-1000, 1000, 1000,-1000, near, far);
    camera3.position.y = 1800 // y轴看向原点，从球的上面往下看
    camera3.up.set(0, 0, 1) // 默认为(0,1,0)，调整快门的方向，和y轴平行

    camera4 = new THREE.PerspectiveCamera(45, 500 / 250, near, far);
    camera4.setViewOffset(500, 250, 0, 0, 500, 250)
    // 斜着看物体
    camera4.position.x = 300
    camera4.position.z = 800
}

var shadowMaterial;

function createShadowByCanvas() {
    // 创建画布
    var canvas = document.createElement("canvas");
    // 设置画布大小宽128，高128
    canvas.width = 128;
    canvas.height = 128;
    // 得到画布的可画类context
    var context = canvas.getContext("2d");
    // 创建一个放射性渐变，渐变从画布的中心开始，到以canvas.width/2为半径的圆结束。如果不明白可以参考：http://www.w3school.com.cn/htmldom/met_canvasrenderingcontext2d_createradialgradient.asp
    var gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    // 在离画布中心canvas.width*0.1的位置添加一种颜色，
    gradient.addColorStop(0.1, "rgba(210,210,210,1)");
    // 在画布渐变的最后位置添加一种颜色，
    gradient.addColorStop(1, "rgba(255,255,255,1)");
    // 填充方式就是刚才创建的渐变填充
    context.fillStyle = gradient;
    // 实际的在画布上绘制渐变。
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 将画布转为纹理
    var shadowTexture = new THREE.CanvasTexture(canvas);
    shadowTexture.needsUpdate = true;
    // 将纹理添加到材质中
    shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture });
}

function initShadowPlane() {
    // 定义一个宽和高都是300的平面，平面内部没有出现多个网格。
    var shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);
    // 构建一个Mesh网格，位置在（0，-250，0），即y轴下面250的距离。
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.y = -250;
    // 围绕x轴旋转-90度，这样竖着的平面就横着了。阴影是需要横着的。
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    // 第二个平面阴影
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = -400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    // 第三个平面阴影
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = 400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
}

// 初始化物体
function initObject() {
    // 20面体的半径是200单位
    var radius = 200;

    // 生成3个20面体
    var geometry1 = new THREE.IcosahedronGeometry(radius, 1);

    // 由于场景中有3个20面体，所以这里通过clone函数复制3个。clone函数将生产一模一样的一个几何体。
    var geometry2 = geometry1.clone();
    var geometry3 = geometry1.clone();

    var faceIndices = ['a', 'b', 'c', 'd'];

    var color, f1, f2, f3, p, n, vertexIndex;
 
    for (var i = 0; i < geometry1.faces.length; i++) {

        f1 = geometry1.faces[i];
        f2 = geometry2.faces[i];
        f3 = geometry3.faces[i];

        n = (f1 instanceof THREE.Face3) ? 3 : 4;

        for (var j = 0; j < n; j++) {

            vertexIndex = f1[faceIndices[j]];

            p = geometry1.vertices[vertexIndex];

            color = new THREE.Color(0xffffff);
            color.setHSL((p.y / radius + 1) / 2, 1.0, 1.0);

            f1.vertexColors[j] = color;

            color = new THREE.Color(0xffffff);
            color.setHSL(0.0, (p.y / radius + 1) / 2, 1.0);

            f2.vertexColors[j] = color;

            color = new THREE.Color(0xffffff);
            color.setHSL(0.125 * vertexIndex / geometry1.vertices.length, 1.0, 1.0);

            f3.vertexColors[j] = color;

        }

    }
    var materials = [

        new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors }),
        new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true })

    ];


    
    /* --几何体1-- */
    group1 = THREE.SceneUtils.createMultiMaterialObject( geometry1, materials );
    group1.position.x = -400;
    group1.rotation.x = -1.87;
    scene.add( group1 );
    /* --几何体2-- */
    group2 = THREE.SceneUtils.createMultiMaterialObject( geometry2, materials );
    group2.position.x = 400;
    group2.rotation.x = 0;
    scene.add( group2 );
    /* --几何体3-- */
    group3 = THREE.SceneUtils.createMultiMaterialObject( geometry3, materials );
    group3.position.x = 0;
    group3.rotation.x = 0;
    scene.add( group3 );
}

// 如果只使用一个渲染器，四个容器中添加这个渲染器，那么会造成只有最后一个容器添加了这个渲染器
function initRenderer() {
    renderer1 = new THREE.WebGLRenderer({ antialias: true });
    renderer1.setSize(500, 250);

    renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2.setSize(500, 250);

    renderer3 = new THREE.WebGLRenderer({ antialias: true });
    renderer3.setSize(500, 250);

    renderer4 = new THREE.WebGLRenderer({ antialias: true });
    renderer4.setSize(500, 250);

    container1.appendChild(renderer1.domElement);
    container2.appendChild(renderer2.domElement);
    container3.appendChild(renderer3.domElement);
    container4.appendChild(renderer4.domElement);
}

function animation() {
    render()
    stats.update()
    requestAnimationFrame(animation);
}


function render() {
    camera1.lookAt(scene.position)
    camera2.lookAt(scene.position)
    camera3.lookAt(scene.position)
    camera4.lookAt(scene.position)

    renderer1.render(scene, camera1)
    renderer2.render(scene, camera2)
    renderer3.render(scene, camera3)
    renderer4.render(scene, camera4)
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}


var stats;
function initStats() {
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // 将stats的界面对应左上角
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    //   document.body.appendChild(stats.dom);
    container1.appendChild(stats.dom);
}