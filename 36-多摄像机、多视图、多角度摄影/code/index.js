// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var views = [];

var scene, renderer;

var light;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


window.addEventListener("load", function (event) {
    console.log("文档以及它包含的资源都已加载完成");
    // console.log(THREE)
    threeStart();
});

function threeStart() {
    // 初始化视图
    initView()
    // 初始化场景
    initScene();
    // 初始化灯光
    initLight();
    // 绘制阴影面
    createShadowByCanvas()
    // 初始化阴影平面
    initShadowPlane()
    // 初始化渲染器
    initRenderer();
    // 初始化物体
    initObject();
    // 渲染循环
    animation();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

// 视图构造函数
function View(canvas, fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight) {

    canvas.width = viewWidth * window.devicePixelRatio;
    canvas.height = viewHeight * window.devicePixelRatio;

    var context = canvas.getContext('2d');

    var camera = new THREE.PerspectiveCamera(20, viewWidth / viewHeight, 1, 10000);
    camera.setViewOffset(fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight);
    camera.position.z = 1800;

    this.render = function () {

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (- mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.setViewport(0, 0, viewWidth, viewHeight);
        renderer.render(scene, camera);

        context.drawImage(renderer.domElement, 0, 0);

    };

}

var fullWidth = 550;
var fullHeight = 600;

function initView() {
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');

    views.push(new View(canvas1, fullWidth, fullHeight, 0, 0, canvas1.clientWidth, canvas1.clientHeight));
    views.push(new View(canvas2, fullWidth, fullHeight, 150, 200, canvas2.clientWidth, canvas2.clientHeight));
    views.push(new View(canvas3, fullWidth, fullHeight, 75, 300, canvas3.clientWidth, canvas3.clientHeight));
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}

function initLight() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);
}

var shadowMaterial;

function createShadowByCanvas() {
    // 创建画布
    var canvas = document.createElement('canvas');
    // 设置画布大小宽128，高128
    canvas.width = 128;
    canvas.height = 128;
    // 得到画布的可画类context
    var context = canvas.getContext('2d');
    // 创建一个放射性渐变，渐变从画布的中心开始，到以canvas.width/2为半径的圆结束。如果不明白可以参考：http://www.w3school.com.cn/htmldom/met_canvasrenderingcontext2d_createradialgradient.asp
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    // 在离画布中心canvas.width*0.1的位置添加一种颜色，
    gradient.addColorStop(0.1, 'rgba(210,210,210,1)');
    // 在画布渐变的最后位置添加一种颜色，
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    // 填充方式就是刚才创建的渐变填充
    context.fillStyle = gradient;
    // 实际的在画布上绘制渐变。
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 将画布转为纹理
    var shadowTexture = new THREE.CanvasTexture(canvas);
    // 将纹理添加到材质中
    shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture });
}

function initShadowPlane() {
    // 定义一个宽和高都是300的平面，平面内部没有出现多个网格。
    var shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);
    // 构建一个Mesh网格，位置在（0，-250，0），即y轴下面250的距离。
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.y = - 250;
    // 围绕x轴旋转-90度，这样竖着的平面就横着了。阴影是需要横着的。
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);
    // 第二个平面阴影
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = - 400;
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);
    // 第三个平面阴影
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = 400;
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);
}

// 初始化物体
function initObject() {
    // 20面体的半径是200单位
    var radius = 200;

    // 生成3个20面体
    var geometry1 = new THREE.IcosahedronBufferGeometry(radius, 1);

    // 从20面体中的顶点数组（geometry1.attributes.position）中获得顶点的个数，目的是为每个顶点设置一个颜色属性
    var count = geometry1.attributes.position.count;
    // 为几何体设置一个颜色属性，颜色属性的属性名必须是‘color’，这样Three.js才认识。
    geometry1.addAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    // 由于场景中有3个20面体，所以这里通过clone函数复制3个。clone函数将生产一模一样的一个几何体。
    var geometry2 = geometry1.clone();
    var geometry3 = geometry1.clone();

    // 这里声明一个临时的颜色值，待会用来作为中间结果。
    var color = new THREE.Color();

    // 获得3个几何体的位置属性数组
    var positions1 = geometry1.attributes.position;
    var positions2 = geometry2.attributes.position;
    var positions3 = geometry3.attributes.position;

    // 获得3个几何体的颜色属性数组
    var colors1 = geometry1.attributes.color;
    var colors2 = geometry2.attributes.color;
    var colors3 = geometry3.attributes.color;

    // 使用HSL颜色空间来设置颜色。下文将简单介绍这种颜色空间。
    // 为每个顶点设置一种颜色
    for (var i = 0; i < count; i++) {

        color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5);
        colors1.setXYZ(i, color.r, color.g, color.b);

        color.setHSL(0, (positions2.getY(i) / radius + 1) / 2, 0.5);
        colors2.setXYZ(i, color.r, color.g, color.b);

        color.setRGB(1, 0.8 - (positions3.getY(i) / radius + 1) / 2, 0);
        colors3.setXYZ(i, color.r, color.g, color.b);

    }

    // Phong网格材质
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
    });
    // 基础网格材质
    var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
    /* --几何体1-- */
    var mesh = new THREE.Mesh(geometry1, material);
    var wireframe = new THREE.Mesh(geometry1, wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = - 400;
    mesh.rotation.x = - 1.87;
    scene.add(mesh);
    /* --几何体2-- */
    var mesh = new THREE.Mesh(geometry2, material);
    var wireframe = new THREE.Mesh(geometry2, wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = 400;
    scene.add(mesh);
    /* --几何体3-- */
    var mesh = new THREE.Mesh(geometry3, material);
    var wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
    mesh.add(wireframe);
    scene.add(mesh);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fullWidth, fullHeight);
}

function animation() {
    for (var i = 0; i < views.length; ++i) {
        views[i].render();
    }
    requestAnimationFrame(animation);
}



function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}