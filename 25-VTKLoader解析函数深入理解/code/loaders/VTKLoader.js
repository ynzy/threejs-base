/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VTKLoader = function (manager) {

	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

};

THREE.VTKLoader.prototype = {

	constructor: THREE.VTKLoader,
	/**
	 * 
	 * @param {*} url url地址
	 * @param {*} onLoad 加载成功回调
	 * @param {*} onProgress 加载过程回调
	 * @param {*} onError 加载错误回调
	 */
	load: function (url, onLoad, onProgress, onError) {

		var scope = this;
		// 调用THREE的XHR请求实例，传入了加载管理器
		var loader = new THREE.XHRLoader(scope.manager);
		// 设置cross
		loader.setCrossOrigin(this.crossOrigin);
		// 调用加载函数，返回文本数据
		loader.load(url, function (text) {
			// 通过parse解析文本数据，返回geometry
			onLoad(scope.parse(text));

		}, onProgress, onError);

	},

	setCrossOrigin: function (value) {

		this.crossOrigin = value;

	},
	// data 加载的文件内容
	parse: function (data) {

		var indices = [];
		var positions = [];

		var result;

		// float float float
		// 匹配三个float变量  -0.0378297 0.12794 0.00447467
		var pat3Floats = /([\-]?[\d]+[\.]?[\d|\-|e]*)[ ]+([\-]?[\d]+[\.]?[\d|\-|e]*)[ ]+([\-]?[\d]+[\.]?[\d|\-|e]*)/g;
		// 匹配3 开头的 3个顶点,组成一个三角形  3 21216 21215 20399 
		var patTriangle = /^3[ ]+([\d]+)[ ]+([\d]+)[ ]+([\d]+)/;
		// 匹配4 开头的 4 个顶点,组成一个四边形
		var patQuad = /^4[ ]+([\d]+)[ ]+([\d]+)[ ]+([\d]+)[ ]+([\d]+)/;
		// 匹配 POINTS 开始的那一行 POINTS 35947 float
		var patPOINTS = /^POINTS /;
		// 匹配 POLYGONS 开始的那一行 POLYGONS 69451 277804
		var patPOLYGONS = /^POLYGONS /;
		var inPointsSection = false;
		var inPolygonsSection = false;

		var lines = data.split('\n'); // 根据每一行进行分割，组成数组
		for (var i = 0; i < lines.length; ++i) {

			line = lines[i];
			// 如果进入到 POINTS 之后的那一行
			if (inPointsSection) {

				// get the vertices
				// 匹配到三个浮点数变量，存入 result
				while ((result = pat3Floats.exec(line)) !== null) {
					// 三个浮点数组成一个顶点，存入 positions
					positions.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				}
			}
			// 如果进入到 POLYGONS 之后的那一行
			else if (inPolygonsSection) {
				// 匹配三个顶点
				result = patTriangle.exec(line);

				if (result !== null) {

					// 3 int int int
					// triangle
					// 把顶点放到索引里
					indices.push(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
				}
				// 匹配四个顶点
				else {

					result = patQuad.exec(line);

					if (result !== null) {

						// 4 int int int int
						// break quad into two triangles

						indices.push(parseInt(result[1]), parseInt(result[2]), parseInt(result[4]));
						indices.push(parseInt(result[2]), parseInt(result[3]), parseInt(result[4]));
					}

				}

			}
			// 如果进入 POLYGONS ,标识进入了
			if (patPOLYGONS.exec(line) !== null) {
				inPointsSection = false;
				inPolygonsSection = true;
			}
			// 如果进入 POINTS，标识进入了
			if (patPOINTS.exec(line) !== null) {
				inPolygonsSection = false;
				inPointsSection = true;
			}
		}
		// 解析完成之后通过BufferGeometry生成geometry
		var geometry = new THREE.BufferGeometry();
		geometry.setIndex(new THREE.BufferAttribute(new (indices.length > 65535 ? Uint32Array : Uint16Array)(indices), 1));
		geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
		// 返回 geometry
		return geometry;

	}

};

THREE.EventDispatcher.prototype.apply(THREE.VTKLoader.prototype);
