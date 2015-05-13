
var scene, camera, renderer;

var time, prevTime, controls, skybox, cubeMapTexture;
var floor, block, paddle, ball, hitbox;
var balls = [];

var gameLength, gameWidth, gameHeight;

var blockWidth, blockLength, blockHeight;
var colSpacing, rowSpacing, layerSpacing, maxCols, maxLayers;
var blockRows, rearBlockSpace;

var ballColor;
var ballGlow = false;
var ballRadius, paddleWidth, paddleDepth;
var wallDepth = 100;

var blockGeometry;
var paddleGeometry;

var floorMaterial;
var blockMaterial;
var paddleMaterial;
var ballMaterial;
var ballShader;
var wallMaterial;
var shadows = false;
var lightingGroup = new THREE.Group();

var raycaster = new THREE.Raycaster();
var group = new THREE.Group();
var wallGroup = new THREE.Group();
var floorMirror;
var ballCamera;

var levelName;
var levelCounter = 0;
var score = 0;
var blockCount = 0;
var ballsRemaining;

var speedFactor, speedThreshold, speedRatio, speedMax;
var initialBallDirection;

init();
setTimeout( ballRadius, 5000 );
animate();

function init() {
	loadLevel(0);
	
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias: false});
	//renderer.setPixelRatio(window.devicePixelRatio);
	//renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setSize(Math.min(window.innerWidth, 1280), Math.min(window.innerHeight, 800));
	$('#score').outerWidth(Math.min(window.innerWidth, 1280));
	$('#scorecounter').text(score);
	
	//Set up camera perspective projection
	//var aspect = window.innerWidth/window.innerHeight; 
	var aspect = Math.min(window.innerWidth, 1280)/Math.min(window.innerHeight, 800);
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);
	camera.position.set(0,400,400);
	camera.lookAt(scene.position);
	
	//skybox
	var urlPrefix = "cubemap/inside2/";
	var cubeURL = [ urlPrefix + "0004.png", urlPrefix + "0002.png",
		urlPrefix + "0006.png", urlPrefix + "0005.png",
		urlPrefix + "0001.png", urlPrefix + "0003.png" ];
	cubeMapTexture = THREE.ImageUtils.loadTextureCube(cubeURL, THREE.CubeRefractionMapping);
	var cubeMapShader = THREE.ShaderLib["cube"];
	cubeMapShader.uniforms[ "tCube" ].value = cubeMapTexture;
	var skyboxMaterial = new THREE.ShaderMaterial({
		fragmentShader: cubeMapShader.fragmentShader,
		vertexShader: cubeMapShader.vertexShader,
		uniforms: cubeMapShader.uniforms,
		side: THREE.BackSide
	});
	skybox = new THREE.Mesh(new THREE.BoxGeometry(8000, 8000, 8000), skyboxMaterial);
	
	loadAppearance(visualStyles.flat);
	scene.add(lightingGroup);
	
	//Add floor
	floor = new THREE.Mesh(new THREE.PlaneGeometry(gameWidth+ballRadius,gameLength+ballRadius), floorMaterial);
	floor.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2); //rotate 90deg to face horizontally
	if(floorMirror)
		floor.add(floorMirror);
	floor.receiveShadow = shadows;
	scene.add(floor);
	
	//Add walls
	var leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallDepth, gameHeight, gameLength+ballRadius), wallMaterial);
	var rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallDepth, gameHeight, gameLength+ballRadius), wallMaterial);
	var rearWall = new THREE.Mesh(new THREE.BoxGeometry(gameWidth+2*wallDepth+ballRadius, gameHeight, wallDepth), wallMaterial);
	rightWall.position.x = gameWidth/2+wallDepth/2+ballRadius/2;
	leftWall.position.x = -rightWall.position.x;
	rearWall.position.z = -gameLength/2-wallDepth/2-ballRadius/2;
	rearWall.position.y = leftWall.position.y = rightWall.position.y = gameHeight/2;
	wallGroup.add(leftWall);
	wallGroup.add(rightWall);
	wallGroup.add(rearWall);
	
	//Set up paddle
	paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle.position.y = gameHeight/2;
	paddle.position.z = gameLength/2-20;
	paddle.receiveShadow = shadows;
	paddle.castShadow = shadows;
	group.add(paddle);
	scene.add(group)
	
	//Set up ball
	addBall();
	
	//Set up block
	block = new THREE.Mesh(new THREE.BoxGeometry(blockWidth,blockHeight,blockLength), blockMaterial);
	block.castShadow = shadows;
	blockWall(blockRows); //create wall

	//Initialize Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI/2;
	$('#game').append(renderer.domElement);
	
	document.addEventListener('mousemove', function(event) {
		paddle.position.x = (event.clientX/window.innerWidth) * gameWidth - gameWidth/2;
		if(paddle.loadedBall)
			paddle.loadedBall.position.x = paddle.position.x;
	});
	
	$("#addBall").click(function() {
		addBall();
		$("#addBall").blur();
	});
	
	$("#wallToggle").change(function() {
		if($("#wallToggle").prop("checked")) {
			scene.add(wallGroup);
		} else {
			scene.remove(wallGroup);
		}
		$("#wallToggle").blur();
	});
	
	$("#envToggle").change(function() {
		if($("#envToggle").prop("checked")) {
			scene.add(skybox);
		} else {
			scene.remove(skybox);
		}
		$("#envToggle").blur();
	});
	
	$("#stylemenu").on('change', function() {
		var opts = [visualStyles.flat, visualStyles.glass, visualStyles.mirror];
		loadAppearance(opts[this.value]);
	});
	
	$(window).keypress(function(event) {
		if((event.keyCode == 32 || event.keyCode == 0) && paddle.loadedBall) {
			event.preventDefault();
			paddle.loadedBall.direction.copy(initialBallDirection).normalize();
			balls.push(paddle.loadedBall);
			paddle.loadedBall = false;
		}
	});
	
	prevTime = performance.now();
}

function animate() {
	time = performance.now();
	if(floorMirror) {
		floorMirror.render();
		if(balls.length>0) {
			ballCamera.position.copy(balls[0].position);
		} else if(paddle.loadedBall) {
			ballCamera.position.copy(paddle.loadedBall.position);
		}
		ballCamera.updateCubeMap(renderer, scene);
	}
	renderer.render(scene, camera);
	controls.update();
	update(time-prevTime);
	prevTime = time;
	if(blockCount == 0) {
		showMsg("Level Complete");
		blockCount++;
		window.setTimeout(function() {loadLevel(++levelCounter)}, 1000);
	}
	// if(!paddle.loadedBall)
		// paddle.position.x = balls[0].position.x;
	requestAnimationFrame(animate);
}

function update(delta) {
	for(var b=0; b < balls.length; b++ ) {
		ball = balls[b];
		if(ball.position.x < -gameWidth/2) {
			ball.direction.x = -ball.direction.x;
			ball.justBounced = false;
			ball.position.x = -gameWidth/2;
		}
		if(ball.position.x > gameWidth/2) {
			ball.direction.x = -ball.direction.x;
			ball.justBounced = false;
			ball.position.x = gameWidth/2;
		}
		if(ball.position.z < -gameLength/2) {
			ball.direction.z = -ball.direction.z;
			ball.justBounced = false;
			ball.position.z = -gameLength/2;
		}
		if(ball.position.z > gameLength/2) {
			balls.splice(b, 1);
			group.remove(ball);
			if(ballsRemaining > 1) {
				addBall();
				$("#ballcounter").text(--ballsRemaining);
			} else {
				$("#ballcounter").text(--ballsRemaining);
				alert("Game Over!");
			}
			continue;
		}
		if(ball.position.y < ballRadius) {
			ball.direction.y = -ball.direction.y;
			ball.justBounced = false;
			ball.position.y = ballRadius;
		}
		if(ball.position.y > gameHeight) {
			ball.direction.y = -ball.direction.y;
			ball.justBounced = false;
			ball.position.y = gameHeight;
		}
				
		hitbox = ball.children[0];
	
		for(var i = 0; i < hitbox.geometry.vertices.length; i++) {
			var directionVector = hitbox.geometry.vertices[i].clone().add(ball.direction);//applyMatrix4(ball.matrix).sub(ball.position);
			raycaster.set(ball.position, directionVector.clone().normalize() );
			
			var collisionResults = raycaster.intersectObjects(group.children);
			if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
				var obj = collisionResults[0].object;
				if(obj.isBlock) {
					group.remove(obj);
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = false;
					$('#scorecounter').text(++score);
					blockCount--;
					if(speedFactor>speedMax && Math.random() < speedThreshold) {
						speedFactor*=speedRatio;
						showMsg("speed increased!");
					}
				} else if(!ball.justBounced) { //prevent balls from getting stuck inside the paddle
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = true;
					break;
				}
			}
		}
		ball.position.add(ball.speed.copy(ball.direction).multiplyScalar(delta/speedFactor));
	}

}

function loadAppearance(style) {
	wallMaterial = style.wallMaterial;
	if(style.ballGlow) {
		ballShader = new THREE.ShaderMaterial({
			uniforms: {
				"c": {type: "f", value: 0.9},
				"p": {type: "f", value: 0.7},
				glowColor: {type: "c", value: new THREE.Color(style.ballMaterial.color)},
				viewVector: {type: "v3", value: camera.position}
			},
			vertexShader: $("#vertexShader").text(),
			fragmentShader: $("#fragmentShader").text(),
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
		ballGlow = new THREE.Mesh(new THREE.SphereGeometry(ballRadius*1.5, 16), ballShader);
	} else {
		ballGlow = false;
	}
	ballMaterial = style.ballMaterial;
	if(style.floorReflection == true) {
		floorMirror = new THREE.Mirror(renderer, camera, { clipBias: 0.03, textureWidth: gameWidth*2, textureHeight: gameLength*2, color: 0x707070 } );
		floorMaterial = floorMirror.material;
		if(floor) {
			floor.material = floorMaterial;
			floor.add(floorMirror);
		}
		ballCamera = new THREE.CubeCamera(ballRadius, 10000, ballRadius);
		scene.add(ballCamera);
		ballMaterial.envMap = ballCamera.renderTarget;
	} else {
		floorMirror = false;
		ballCamera = false;
		floorMaterial = style.floorMaterial;
		if(floor) {
			floor.material = floorMaterial;
		}
	}
	blockMaterial = style.blockMaterial;
	if(style.blockRefraction == true) {
		blockMaterial.envMap=cubeMapTexture;
		blockMaterial.refractionRatio=0.85;
	}
	paddleMaterial = style.paddleMaterial;
	if(group.children.length > 0) {
		group.children[0].material = paddleMaterial;
		for(var i = 1; i < group.children.length; i++) { //update materials
			var obj = group.children[i];
			if(obj.isBlock) {
				var material = blockMaterial.clone();
				material.color.copy(obj.material.color);
				obj.material.dispose();
				obj.material = material;
			} else { //its a ball
				if(!ballGlow) {
					obj.remove(obj.children[1]);
				} else {
					obj.add(ballGlow);
					obj.add(new THREE.PointLight(obj.material.color));
				}
				obj.material = ballMaterial;
			}
		}
	}
	renderer.setClearColor(style.bgColor);
	for(var i = 0; i < lightingGroup.children.length; i++) { //clear existing lights
		lightingGroup.remove(lightingGroup.children[i]);
	}
	if(style.ambientLight) {
		lightingGroup.add(style.ambientLight);
	}
	if(style.shadowLighting) {
		for(var i = 0; i<style.shadowLighting.length; i+=2) {
			var dLight = style.shadowLighting[i];
			dLight.onlyShadow = true;
			dLight.castShadow = true;
			dLight.position.copy(style.shadowLighting[i+1]);
			lightingGroup.add(dLight);
		}
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		shadows = true;
	} else {
		shadows = false;
	}
	renderer.shadowMapEnabled = shadows;
	if(floor) {
		floor.receiveShadow = shadows;
	}
	if(block) {
		block.castShadow = shadows;
	}
	if(paddle) {
		paddle.castShadow = shadows;
	}
	for(var i = 0; i<style.pointLighting.length; i+=2) {
		var ptLight = style.pointLighting[i];
		ptLight.position.copy(style.pointLighting[i+1]);
		lightingGroup.add(ptLight);
	}
}

function loadLevel(level) {
	console.log("Loading Level "+level);
	var data = levels[level];
	levelName = data.name;
	gameWidth = data.gameWidth;
	gameLength = data.gameLength;
	gameHeight = data.gameHeight;
	blockWidth = data.blockWidth;
	blockLength = data.blockLength;
	blockHeight = data.blockHeight;
	blockRows = data.rows;
	rearBlockSpace = data.rearSpace;
	colSpacing = data.colSpacing;
	rowSpacing = data.rowSpacing;
	layerSpacing = data.layerSpacing;
	ballRadius = data.ballRadius;
	paddleWidth = data.paddleWidth;
	paddleDepth = data.paddleDepth;
	maxCols = Math.floor(gameWidth/(blockWidth+colSpacing));
	maxLayers = Math.floor(gameHeight/(blockHeight+layerSpacing));
	ballsRemaining = data.initialBalls;
	speedFactor = data.initialSpeedFactor;
	speedThreshold = data.speedThreshold;
	speedRatio = data.speedRatio;
	speedMax = data.maxSpeedFactor;
	paddleGeometry = data.paddleGeometry();
	initialBallDirection = data.initialBallDirection;
	levelCounter = level;
	showMsg("Level "+Number(levelCounter+1));
	$("#ballcounter").text(ballsRemaining);
	
	if(scene) { //clear previous
		paddle.geometry.dispose();
		paddle.geometry = paddleGeometry;
		paddle.position.x = 0;
		paddle.position.y = gameHeight/2;
		paddle.position.z = gameLength/2-20;
		
		floor.geometry.dispose();
		floor.geometry = new THREE.PlaneGeometry(gameWidth+ballRadius,gameLength+ballRadius);
		block.geometry.dispose();
		block.geometry = new THREE.BoxGeometry(blockWidth,blockHeight,blockLength);
		
		var leftWall = wallGroup.children[0];
		var rightWall = wallGroup.children[1];
		var rearWall = wallGroup.children[2];
		leftWall.geometry.dispose();
		rightWall.geometry.dispose();
		rearWall.geometry.dispose();
		leftWall.geometry = new THREE.BoxGeometry(wallDepth, gameHeight, gameLength+ballRadius);
		rightWall.geometry = new THREE.BoxGeometry(wallDepth, gameHeight, gameLength+ballRadius);
		rearWall.geometry = new THREE.BoxGeometry(gameWidth+2*wallDepth+ballRadius, gameHeight, wallDepth);
		rightWall.position.x = gameWidth/2+wallDepth/2+ballRadius/2;
		leftWall.position.x = -rightWall.position.x;
		rearWall.position.z = -gameLength/2-wallDepth/2-ballRadius/2;
		rearWall.position.y = leftWall.position.y = rightWall.position.y = gameHeight/2;
		
		balls = [];
		
		for(var i=group.children.length-1; i>0; i--) {
			var object = group.children[i];
			if(object.geometry) {
				object.geometry.dispose();
			}
			if(object.material) {
				object.material.dispose();
			}
			group.remove(object);
		}
		blockWall(blockRows);
		paddle.loadedBall = false;
		addBall();
	}
}

function blockWall(rows) {
	var counter = 0;
	for(var z = 0; z < rows; z++) {
		var material = blockMaterial.clone();
		material.color.setHex(Math.random() * 0xffffff);
		for(var x = 0; x < maxCols; x++) {
			for(var y = 0; y < maxLayers; y++) {
				blockAt(x,y,z,material);
				counter++;
			}
		}
	}
	console.log(counter+" blocks added");
	blockCount = counter;
}

function blockAt(x, y, z, blockMaterial) {
	var blockCopy = block.clone();
	if(arguments.length == 4) {
		blockCopy.material = blockMaterial;
	}
	blockCopy.isBlock = true;
	blockCopy.position.x = x * (blockWidth+colSpacing) - (blockWidth+colSpacing)*(maxCols-1)/2;
	blockCopy.position.z = z * (blockLength+rowSpacing) - gameLength/2 + rearBlockSpace;
	blockCopy.position.y = y * (blockHeight+layerSpacing) + blockHeight/2;
	group.add(blockCopy);
}

function addBall() {
	if(!paddle.loadedBall) {
		var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 16), ballMaterial.clone());
		ball.position.y = ballRadius;
		ball.position.x = paddle.position.x;
		ball.position.z = paddle.position.z-ballRadius-paddleDepth;
		ball.justBounced = false;
		
		//x = diameter/sqrt(3) THREE.DodecahedronGeometry(ballRadius));
		var hitbox = new THREE.Mesh(new THREE.DodecahedronGeometry(ballRadius));
		hitbox.visible = false;
		ball.add(hitbox);
		
		if(ballGlow) {
			ball.add(ballGlow.clone());
			ball.add(new THREE.PointLight(ball.material.color));
		}
		if(shadows) {
			ball.castShadow = true;
		}
		ball.speed = new THREE.Vector3();
		ball.direction = new THREE.Vector3();//.set(Math.random()-0.5, 0, -0.5).normalize();
		
		paddle.loadedBall = ball;
		group.add(ball);
	}
}

function showMsg(msg) {
	$("#msg").fadeOut(100, function() {
		$("#msg").text(msg);
		$("#msg").fadeIn(100).delay(1000).fadeOut(100, function() {
			$("#msg").text("Level "+Number(levelCounter+1)+": "+levelName);
			$("#msg").fadeIn(100)
		});
	});
}

function unload() {
	
}