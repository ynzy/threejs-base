// 判断浏览器是否可以渲染3D场景
if (!Detector.webgl) Detector.addGetWebGLMessage();
const base_url = "https://threejs-models.vercel.app";


window.addEventListener("load", function (event) {
  console.log("文档以及它包含的资源都已加载完成");
  main()
});

var clock = new THREE.Clock();

// 入口函数
function main() {
  GAME.init()
}

// 地图类
const MAPS = (function () {
  var maps = []
  maps[0] = {
    // 地图数据
    mapString: `\
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 70 30 10 00 00 10 30 70 F0 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 70 30 10 00 00 10 30 70 F0 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF F0 00 00 00 00 00 00 00 00 0F FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 F0 00 00 F3 00 FF \
        FF 00 00 00 00 00 00 00 00 FF 00 FF \
        FF 00 0F 00 00 F1 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 FF 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 FF 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 FF 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 FF 00 00 FF \
        FF 00 00 00 FF 00 FF 00 00 00 00 FF \
        FF 00 00 00 00 00 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 FF FF FF FF FF FF \
        FF 00 00 00 00 FF 00 00 00 00 00 FF \
        FF 00 00 00 FF 00 FF FF FF FF FF FF \
        FF FF FF AA FF 00 00 FF FF FF FF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF FF FF AA AA FF FF FF FF FF FF FF \
        FF FF FF 00 00 00 00 FF FF FF FF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 32 00 EA EA EF EF FF FF A8 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 FF 00 00 00 00 FF \
        FF FF FF FF 0F 0F 0F FF FF FF FF 00 \
        FF 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 87 00 00 44 00 A0 00 00 00 \
        FF FF FF 00 00 00 B3 FF FF 00 00 00 \
        FF FF FF 00 00 0A FF FF FF 00 00 00 \
        00 FF FF 00 FF FF 00 FF FF FF 0F F0 \
        00 00 0F 00 00 F0 00 FF FF FF FF 00 \
        FF 00 FF 00 FF 00 00 FF FF 00 00 00 \
        00 FF FF 18 FA 00 00 32 56 87 95 00 \
        00 FF FF 3C FA 0F FF 32 56 87 00 00 \
        00 FF FF 7E FA 0F FF 32 56 87 00 00 \
        00 FF FF 8E FA 0F FF 32 56 87 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        00 00 00 00 00 00 00 00 00 00 00 00 \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 FF 00 FF 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF AA 55 AA 55 AA 55 AA 55 AA 55 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 55 AA 55 AA 55 AA 55 AA 55 AA FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF AA 55 AA 55 AA 55 AA 55 AA 55 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 55 AA 55 AA 55 AA 55 AA 55 AA FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 FF FF 00 00 00 00 FF \
        FF 00 00 00 FF 00 00 FF 00 00 00 FF \
        FF 00 00 FF 00 00 00 00 FF 00 00 FF \
        FF 00 FF 00 00 FF FF 00 00 FF 00 FF \
        FF 00 F0 00 00 FF FF 00 00 F0 00 FF \
        FF 00 F0 00 00 FF FF 00 00 F0 00 FF \
        FF 00 F0 00 00 00 00 00 00 F0 00 FF \
        FF 00 F0 00 00 00 00 00 00 F0 00 FF \
        00 FF FF 00 00 00 00 00 00 FF FF FF \
        00 00 FF 00 00 00 00 00 00 00 FF 00 \
        00 FF 00 00 00 00 00 00 00 00 FF 00 \
        00 00 00 00 00 10 10 10 00 00 FF 00 \
        FF 00 00 00 00 10 00 10 00 00 00 FF \
        FF 00 00 00 00 10 10 10 00 00 00 FF \
        FF 00 10 00 00 00 00 00 00 00 00 FF \
        FF 10 F0 10 00 00 00 00 00 00 00 FF \
        FF F0 F1 F0 10 00 00 00 00 00 00 FF \
        FF F1 F3 F1 F0 00 00 00 00 00 00 FF \
        FF F3 FF F3 F1 00 00 00 00 00 00 FF \
        FF FF FF 00 FF F0 FF F0 FF F0 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 FF AA A4 FF A4 33 33 00 00 FF \
        FF 00 00 00 FF 00 A4 33 33 00 00 FF \
        FF 00 00 00 00 00 A4 00 00 00 00 FF \
        FF 00 00 00 00 00 A4 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF DF DF DF DF DF DF DF DF DF DF FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 08 FF 08 FF 08 FF 08 FF 08 FF FF \
        FF 08 08 08 08 08 08 08 08 08 00 FF \
        FF 0F 00 0F 00 0F 00 0F 00 0F 00 FF \
        FF 8F 00 8F 00 8F 00 8F 00 8F 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF FB FB FB FB FB FB FB FB FB FB FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF E7 C3 81 81 81 81 81 81 C3 E7 FF \
        FF FF E7 C3 C3 C3 C3 C3 C3 E7 FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF E7 E7 E7 E7 E7 E7 FF FF FF \
        FF FF FF FF E7 E7 E7 E7 FF FF FF FF \
        FF FF FF FF E7 FF FF E7 FF FF FF FF \
        FF FF FF FF E7 FF FF E7 FF FF FF FF \
        FF 81 81 A5 A5 BD BD A5 A5 81 81 FF \
        FF 81 81 A5 A5 BD BD A5 A5 81 81 FF \
        FF 81 81 87 85 9D 9D 85 87 81 81 FF \
        FF 81 81 DF 85 C5 C5 85 DF 81 81 FF \
        FF 85 85 C5 9D C5 DD 85 C5 85 87 FF \
        FF 85 85 C5 01 01 01 01 C5 85 87 FF \
        FF 8D C5 01 01 01 01 01 01 C5 8F FF \
        FF CD 01 01 00 00 00 01 01 01 CD FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF EE BB 80 BB EE 03 DE 73 3D E7 FF \
        FF EF BB 89 BB FF 63 FF 73 3D EF FF \
        FF C5 B5 89 BB C7 03 FF 43 05 FF FF \
        FF 45 01 01 0F 07 03 FF 03 05 0F FF \
        FF 00 00 00 00 00 00 FF 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 06 42 7E 40 00 72 52 5E 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        FF 00 00 00 00 00 00 00 00 00 00 FF \
        `,
    // 每一个元素占多少字节
    charsPerElement: 2
  };
  var width = 12,
      cubeScale = 10,  // 立方体大小
      //slope=1*Math.PI/12,
      slope = 0,
      mapMesh = false,
      collider = false,
      ymax = 0,
      ground = false,
      cubesMesh = false;

  return {
    // 解析地图
    parse_level: function (lvl) {
      //* r49版本没有立方体,需要自己绘制立方体(建筑)
      var cubeGeometry, roofGeometry;
      // 6个面，正面反面
      var posZ = new THREE.PlaneGeometry(cubeScale, cubeScale); // 10 10
      var negZ = new THREE.PlaneGeometry(cubeScale, cubeScale);
      var posX = new THREE.PlaneGeometry(cubeScale, cubeScale);
      var negX = new THREE.PlaneGeometry(cubeScale, cubeScale);
      var posY = new THREE.PlaneGeometry(cubeScale, cubeScale);
      var negY = new THREE.PlaneGeometry(cubeScale, cubeScale);

      matrix = new THREE.Matrix4(); // 设置四维矩阵
      // r49的平面是平着的，需要先围绕z轴旋转90度
      matrix.makeRotationZ(Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      negX.applyMatrix(matrix);

      matrix.identity(); // 初始化矩阵
      matrix.makeRotationZ(-Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      posX.applyMatrix(matrix);

      matrix.identity();
      matrix.makeRotationX(Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      negZ.applyMatrix(matrix);

      matrix.identity();
      matrix.makeRotationX(-Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      posZ.applyMatrix(matrix);

      matrix.identity();
      matrix.makeRotationY(Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      negY.applyMatrix(matrix);

      matrix.identity();
      matrix.makeRotationY(-Math.PI / 2);
      matrix.translate({ x: 0, y: cubeScale / 2, z: 0 });
      posY.applyMatrix(matrix);
      //* 合并所有立方体，让引擎一次渲染所有立方体，提高渲染速度
      // 0415的贴图不一样，组合成一个立方体
      cubeGeometry = negX;
      THREE.GeometryUtils.merge(cubeGeometry, posX);
      THREE.GeometryUtils.merge(cubeGeometry, posZ);
      THREE.GeometryUtils.merge(cubeGeometry, negZ);
      // 上下两个面23的贴图一样，组合成一个立方体
      roofGeometry = negY;
      THREE.GeometryUtils.merge(roofGeometry, posY);

      //* 制作纹理
      var building_textures = [
        THREE.ImageUtils.loadTexture("images/buildings/1.jpg"),
        THREE.ImageUtils.loadTexture("images/buildings/2.jpg"),
        THREE.ImageUtils.loadTexture("images/buildings/3.jpg"),
        THREE.ImageUtils.loadTexture("images/buildings/4.jpg"),
        THREE.ImageUtils.loadTexture("images/buildings/5.jpg"),
      ];
      // 设置纹理重复次数为1次
      building_textures[0].repeat.set(1, 1);
      building_textures[1].repeat.set(1, 1);
      building_textures[2].repeat.set(1, 1);
      building_textures[3].repeat.set(1, 1);
      building_textures[4].repeat.set(1, 1);
      // 设置纹理回环
      building_textures.map(function (building_texture) {
        building_texture.wrapS = building_texture.wrapT = THREE.RepeatWrapping;
      });
      // 定义材质
      var building_materials = [
        new THREE.MeshPhongMaterial({
          map: building_textures[0],
          color: 0xffffff,
          ambient: 0x777777,
          specular: 0x999999,
          shininess: 15,
          shading: THREE.SmoothShading,
        }),
        new THREE.MeshPhongMaterial({
          map: building_textures[1],
          color: 0xffffff,
          ambient: 0x777777,
          specular: 0x999999,
          shininess: 15,
          shading: THREE.SmoothShading,
        }),
        new THREE.MeshPhongMaterial({
          map: building_textures[2],
          color: 0xffffff,
          ambient: 0x777777,
          specular: 0x999999,
          shininess: 15,
          shading: THREE.SmoothShading,
        }),
        new THREE.MeshPhongMaterial({
          map: building_textures[3],
          color: 0xffffff,
          ambient: 0x777777,
          specular: 0x999999,
          shininess: 15,
          shading: THREE.SmoothShading,
        }),
        new THREE.MeshPhongMaterial({
          map: building_textures[4],
          color: 0xffffff,
          ambient: 0x777777,
          specular: 0x999999,
          shininess: 15,
          shading: THREE.SmoothShading,
        }),
      ];
      // 天花板纹理
      var roof_texture = THREE.ImageUtils.loadTexture("images/roof.jpg");
      roof_texture.repeat.set(4, 4);
      roof_texture.wrapS = roof_texture.wrapT = THREE.RepeatWrapping;
      // 天花板材质
      var roof_material = new THREE.MeshPhongMaterial({
        map: roof_texture,
        color: 0xffffff,
        ambient: 0x777777,
        specular: 0x999999,
        shininess: 15,
        shading: THREE.SmoothShading,
      });

      //* 解析地图数据，并设置地图,把立方体放到正确的位置
      var lvlString = maps[lvl].mapString;
      var zde = 0; // 步数
      var zou = [];
      var cumulated_c = "";
      var matrix;
      var z, c;
      for (var i = 0; i < lvlString.length; i++) {
        c = lvlString.charAt(i);
        if (c == "\n" || c == " ") continue;
        //  \n 0-9 A-F
        // a-f需要转化成10进制数字
        c = c == "A" ? "10" : c;
        c = c == "B" ? "11" : c;
        c = c == "C" ? "12" : c;
        c = c == "D" ? "13" : c;
        c = c == "E" ? "14" : c;
        c = c == "F" ? "15" : c;

        // 10进制转换成2进制
        c = parseInt(c).toString(2);
        // 1010  我们需要4位数，不够就补0
        while (c.length < 4) {
          c = "0" + c;
        }
        // 组合成8位数
        cumulated_c = c + cumulated_c;
        zde++;
        if (zde < maps[lvl].charsPerElement) {
          continue;
        }
        zde = 0;

        // 创建建筑物
        // cumulated_c A3 = 00101010 zou = [false,false,ture,false,...]
        for (var h = 0; h < cumulated_c.length; h++) {
          z = h - cumulated_c.length;
          // 从最后一个字符开始判断
          if (cumulated_c.charAt(cumulated_c.length - h - 1) === "0") {
            zou.push(false);
            continue;
          }
          zou.push(true);

          // 生成建筑物
          var cube = THREE.GeometryUtils.clone(cubeGeometry);
          var roof = THREE.GeometryUtils.clone(roofGeometry);
          var texture_indice = Math.floor(
            Math.random() * building_materials.length
          ); // 随机四面材质索引

          // 合并天花板，天花板材质是一样的所以可以合并
          var roofs = null;
          if (roofs) {
            THREE.GeometryUtils.merge(roofs, roof);
          } else {
            roofs = roof;
          }

          // 合并四面相同的材质
          var cubes = [];
          if (cubes[texture_indice]) {
            THREE.GeometryUtils.merge(cubes[texture_indice], cube);
          } else {
            cubes[texture_indice] = cube;
          }
        }

        //* 设置碰撞数据
        var collider = [[]],
          x,
          y = 0;
        collider[y][x] = zou;
        x++;
        // 重置参数，去计算下一行的碰撞关系
        cumulated_c = "";
        if (x >= width) {
          x = 0;
          y++;
          collider[y] = [];
        }
      }

      // 绘制地图
      for (var i = 0; i < cubes.length; i++) {
        if (!cubes[i]) continue;
        cubesMesh = new THREE.Mesh(cubes[i], building_materials[i]);
        cubesMesh.receiveShadow = true; // 根据光照产生阴影
        scene.add(cubesMesh);
      }
      scene.add(new THREE.Mesh(roofs, roof_material));

      return;
    },
    // 设置地面
    set_ground: function () {
      var ground_texture = THREE.ImageUtils.loadTexture("images/ground.jpg");
      // 设置纹理重复
      ground_texture.repeat.set(width, ymax);
      ground_texture.wrapS = ground_texture.wrapT = THREE.RepeatWrapping;
      // 材质
      var ground_material = new THREE.MeshPhongMaterial({
        map: ground_texture,
        color: 0xffffff,
        ambient: 0x111111,
        specular: 0x999999,
        shininess: 15,
        shading: THREE.SmoothShading,
      });
      // 平面
      var groundGeometry = new THREE.PlaneGeometry(
        width * cubeScale,
        (cubeScale * ymax) / Math.cos(slope)
      );
      // 旋转平面
      var matrix = new THREE.Matrix4();
      matrix.makeRotationX(Math.atan(Math.sin(slope)));
      groundGeometry.applyMatrix(matrix);
      var groundMesh = new THREE.Mesh(groundGeometry, ground_material);
      //groundMesh.castShadow = true;
      groundMesh.receiveShadow = true;

      //groundMesh.rotation.z=0;
      //groundMesh.rotation.x=slope;

      groundMesh.translateZ(ymax * 0.5 * cubeScale - 0.5 * cubeScale);
      groundMesh.translateY(
        (-this.get_lvlHight() - ymax * 0.5 * Math.sin(slope)) * cubeScale
      );
      groundMesh.translateX(-0.5 * cubeScale);
      groundMesh.updateMatrix();
      if (ground) scene.del(ground);
      scene.add(groundMesh);
    },
    // 设置关卡等级
    set_level: function (lvl) {
      this.current = lvl;
      this.parse_level(lvl);
      this.set_ground();
    },
    // 碰撞检测
    collide: function (position) {
      // 飞机的位置在方块的哪里
      var x = Math.round(position.x / cubeScale + width / 2);
      var y = Math.round(position.z / cubeScale); // 屏幕到里的位置
      var z = Math.round(
        this.get_lvlHight() + position.y / cubeScale + y * Math.sin(slope)
      );
      if ( this.get_lvlHight() * cubeScale + position.y + y * Math.sin(slope) * cubeScale < -0.1 * cubeScale ) return true;
      // 如果飞机已经到地面了

      // xyz已经超出了场景
      if (x < 0 || x >= width) return true;
      // 还没有进入方格
      if (y < 0) return false;
      // 飞到最后一排方格，表示游戏赢了
      if (y >= collider.length - 1) {
        GAME.win();
        return false;
      }
      return collider[y][x][z];
    },
    // 获取地图宽度
    get_width: function () { return width; },
    // 获取最大高度
    get_zmax: function () {return -y * Math.sin(slope);},
    // 获取斜坡角度
    get_slope: function () { return slope; },
    // 获取楼房高度
    get_lvlHight: function () {
      // return 8
      return maps[this.current].charsPerElement * 4;
    },
  };
})()

// 控制飞机飞行的类
var NAVIGATION = (function(){
  var X_sensibility = 0.02,
    Y_sensibility = 0.02,
    speed = 0.5,
    back = 1.08,
    theta = 0,
    gamespeed = 50, // 游戏速度
    phiMin = -Math.PI / 4, // 45
    phi = 0;
  var fall = -speed * Math.sin(MAPS.get_slope());
  var keyDowns = []; // 表示按下的键
  var delta = 0;
  return {
    keydown: function(event){
      event.preventDefault();
      switch (event.keyCode) {
        case 37: // left
          NAVIGATION.addKeyDown(37);
          break;
        case 39: // right
          NAVIGATION.addKeyDown(39);
          break;
        case 38: // up
          NAVIGATION.addKeyDown(38);
          break;
        case 40: // down
          NAVIGATION.addKeyDown(40);
          break;
      }
    },
    keyup: function(event) {
      event.preventDefault();
      switch (event.keyCode) {
        case 37: // left
          NAVIGATION.delKeyDown(37);
          break;
        case 39: // right
          NAVIGATION.delKeyDown(39);
          break;
        case 38: // up
          NAVIGATION.delKeyDown(38);
          break;
        case 40: // down
          NAVIGATION.delKeyDown(40);
          break;
      }
    },
    // 添加键
    addKeyDown:function(keyCode) {
      // 如果数组中有这个键就不添加了
      if(keyDowns.indexOf(keyCode) !== -1) {
        return
      }
      keyDowns.push(keyCode)
    },
    // 删除键
    delKeyDown: function(keyCode) {
      keyDowns.splice(keyDowns.indexOf(keyCode),1)
    },
    update: function(raw_delta){
      // 计算上一次调用update到这一次调用的时间
      delta = raw_delta * gamespeed;
      // 做飞机和建筑物的碰撞检测
      if(!tux) return;
      // 碰撞了游戏失败
      if(MAPS.collide(tux.position)) {
        GAME.loose()
      }

      // 根据按键变化飞机的位置和姿势

      // 变换相机的位置


    }
  }
})()

// 游戏类
const GAME = (function () {
  const show = function (id) {
    const dom = document.getElementById(id)
    dom.style.display = "block"
  }
  const hide = function (id) {
    const dom = document.getElementById(id)
    dom.style.display = "none"
  }
  return {
    running: false, // 游戏状态
    // 玩家输了比赛
    // 玩家赢了比赛

    // 玩家第一次开始比赛
    start: function () {
      hide('start')
      this.running = true
      // 播放音乐

    },
    // 重新开始比赛
    restart: function () {

    },
    // 初始化
    init: function () {
      // 显示开始界面
      show('start')
      // 初始化游戏和游戏引擎(three.js)
      if (!initEngine()) {
        animate()
      }
      // 设置关卡
      MAPS.set_level(0)
      // 设置键盘操控类
    }
  }
})()

// 初始化游戏引擎
function initEngine() {
  // 初始化视图
  initView();
  // 初始化渲染器
  initRenderer();
  // 初始化场景
  initScene();
  // 初始化相机
  initCamera();
  // 初始化灯光
  initLight();
  // 加载天空盒
  initSkyBox();
  // 加载模型
  initObject();
}

var container;
// 视图
function initView() {
  container = document.createElement("div");
  document.body.appendChild(container);
}

var renderer;
// 渲染器
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setClearColorHex(0xbbbbbb, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true
  renderer.shadowMapSoft = true
  container.appendChild(renderer.domElement);
}

var scene;
// 场景
function initScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000022, 10, 300);
}

const near = 1;
const far = 10000;
var camera;
// 摄像机
function initCamera() {
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(0, 0, 5)
  camera.updateMatrix()
  scene.add(camera)
}


var ambientLight, pointLight, spotLight, shadowLight;
// 灯光
function initLight() {
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0xff6600, 1, 50);
  scene.add(pointLight);

  spotLight = new THREE.SpotLight(0xaaaaaa, 2, 0, Math.PI / 4, 1);
  spotLight.position.set(0, 0, -1);
  spotLight.castShadow = false;
  scene.add(spotLight);

  shadowLight = new THREE.DirectionalLight(0xaaaaaa, 4, 1);
  shadowLight.position.set(0, 0, -1);
  shadowLight.castShadow = true;
  shadowLight.onlyShadow = true;
  shadowLight.shadowCameraNear = 2;
  shadowLight.shadowCameraFar = 200;
  shadowLight.shadowCameraLeft = -10;
  shadowLight.shadowCameraRight = 10;
  shadowLight.shadowCameraTop = 10;
  shadowLight.shadowCameraBottom = -10;
  shadowLight.shadowCameraVisible = false;
  shadowLight.shadowBias = 0;
  shadowLight.shadowDarkness = 0.5;
  shadowLight.shadowMapWidth = 512;
  shadowLight.shadowMapHeight = 512;
  scene.add(shadowLight);
}

var skyboxMesh;
// 天空盒
function initSkyBox() {
  // 加载纹理
  var textureCube = THREE.ImageUtils.loadTextureCube(["images/skybox/posx.jpg", "images/skybox/negx.jpg", "images/skybox/posy.jpg", "images/skybox/negy.jpg", "images/skybox/posz.jpg", "images/skybox/negz.jpg"]);
  // 创建立方体着色器
  var shader = THREE.ShaderUtils.lib["cube"];
  //var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  shader.uniforms["tCube"].texture = textureCube;
  shader.uniforms["tFlip"].texture = -1;
  //uniforms['tCube'].texture= textureCube; // textureCube has been init before
  // 创建材质
  var cubeMaterial = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
  });
  cubeMaterial.overdraw = true;
  // 创建天空盒立方体
  skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), cubeMaterial);
  skyboxMesh.flipSided = true;
  skyboxMesh.castShadow = false;
  skyboxMesh.receiveShadow = false;

  scene.add(skyboxMesh);
}

var tux;
// 模型
function initObject() {
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load('tux.dae', function colladaReady(collada) {
    var tuxScene = collada.scene;
    skin = collada.skins[0];

    tuxScene.scale.x = tuxScene.scale.y = tuxScene.scale.z = 1;
    tuxScene.updateMatrix();
    spotLight.target = tuxScene;
    shadowLight.target = tuxScene;
    tux = tuxScene;
    tux.children[0].castShadow = true;
    tux.children[0].receiveShadow = false;
    //camera.lookAt(tux);
    //camera.updateMatrix();
    scene.add(tux);
  });

}


function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  NAVIGATION.update(clock.getDelta());
  renderer.render(scene, camera)
}
