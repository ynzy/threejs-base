const base_url = 'https://threejs-models.vercel.app'
// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();

var controls, stats;

var camera, scene, renderer;

var light;

var param;

const clearColor = 0x000000; // 0xFFFFFF

const near = 1;
const far = 2000;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, near, far);
    camera.position.z = 100;
    scene.add(camera);
}

function initLight() {
    scene.add(new THREE.AmbientLight(0x101030));

    light = new THREE.DirectionalLight(0xffeedd);
    light.position.set(0, 0, 1);
    scene.add(light);

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
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    }
    // 加载材质
    var texture = new THREE.Texture();
    var texture2 = new THREE.Texture();

    var loader = new THREE.ImageLoader(manager);
    loader.setCrossOrigin("Anonymous");  // 解决跨域问题
    // ../../static/textures/UV_Grid_Sm.jpg
    loader.load(`${base_url}/textures/UV_Grid_Sm.jpg`, function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    })
    loader.load(`${base_url}/textures/disturb.jpg`, function (image) {
        texture2.image = image;
        texture2.needsUpdate = true;
    })


    // 加载模型
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    }
    var onError = function (xhr) {

    }
    var i = 0;
    var objLoader = new THREE.OBJLoader(manager)
    objLoader.setCrossOrigin("Anonymous");  // 解决跨域问题
    // ../../static/models/obj/male02/male02.obj
    objLoader.load(`${base_url}/models/obj/male02/male02.obj`, function (object) {
        console.log(object);
        // 遍历子模型
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                // 当取模等于0的时候赋予纹理2
                if (i % 2 == 0) {
                    child.material.map = texture2
                } else {
                    child.material.map = texture
                }
                i++
            }
        })
        object.position.y = -80
        scene.add(object)
    }, onProgress, onError)


}

/* 数据更新 */
function update() {

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
    // initGUI();
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
    // renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio)

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
}

function initScene() {
    scene = new THREE.Scene();
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