
var scene, camera, renderer;

var time, prevTime, controls, cubeURL, cubeMapTexture;
var block, paddle, ball, hitbox;
var balls = [];

var gameLength = 400;
var gameWidth = 250;
var gameHeight = 100;

var blockWidth = 25;
var blockLength = 10;
var blockHeight = 10;
var colSpacing = 3;
var rowSpacing = 5;
var layerSpacing = 3;
var maxCols = Math.floor(gameWidth/(blockWidth+colSpacing));
var maxLayers = Math.floor(gameHeight/(blockHeight+layerSpacing));

var ballColor;
var ballGlow = false;
var ballRadius = 5;
var paddleWidth = 50;
var paddleDepth = 5;
var wallDepth = 100;

var blockGeometry;
var paddleGeometry;

var floorMaterial;
var blockMaterial;
var paddleMaterial;
var ballMaterial;
var ballShader;
var lightingGroup = new THREE.Group();

var raycaster = new THREE.Raycaster();
var group = new THREE.Group();
var wallGroup = new THREE.Group();
var floorMirror;
var ballCamera;

var score = 0;

init();
setTimeout( ballRadius, 5000 );
animate();

function init() {
	//Stuff
	paddleGeometry = new THREE.Geometry();
	paddleGeometry.vertices.push(
		new THREE.Vector3(-paddleWidth/2,  gameHeight/2, paddleDepth),
		new THREE.Vector3(-paddleWidth/2+10,  gameHeight/2, -paddleDepth),
		new THREE.Vector3(paddleWidth/2,  gameHeight/2, paddleDepth),
		new THREE.Vector3(paddleWidth/2-10,  gameHeight/2, -paddleDepth),
		
		new THREE.Vector3(-paddleWidth/2,  -gameHeight/2, paddleDepth),
		new THREE.Vector3(-paddleWidth/2+10,  -gameHeight/2, -paddleDepth),
		new THREE.Vector3(paddleWidth/2,  -gameHeight/2, paddleDepth),
		new THREE.Vector3(paddleWidth/2-10,  -gameHeight/2, -paddleDepth)
	);

	paddleGeometry.faces.push(
		new THREE.Face3(0,3,1),
		new THREE.Face3(0,2,3),
		new THREE.Face3(0,6,2),
		new THREE.Face3(0,4,6),
		new THREE.Face3(0,5,4),
		new THREE.Face3(0,1,5),
		new THREE.Face3(1,3,7),
		new THREE.Face3(1,7,5),
		new THREE.Face3(3,6,7),
		new THREE.Face3(3,2,6)
	);
	paddleGeometry.computeFaceNormals();
	//paddleGeometry = new THREE.CylinderGeometry(paddleDepth*2,paddleDepth, gameHeight, 10 );
	//paddleGeometry = new THREE.BoxGeometry(paddleWidth, gameHeight, paddleDepth*2);	
	
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias: true});
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
	var urlPrefix = "cubemap/inside1/";
	cubeURL = [ urlPrefix + "0004.png", urlPrefix + "0002.png",
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
	scene.add(new THREE.Mesh(new THREE.BoxGeometry(8000, 8000, 8000), skyboxMaterial));
	
	loadAppearance(visualStyles.flat);
	scene.add(lightingGroup);
	
	//Add floor
	floor = new THREE.Mesh(new THREE.PlaneGeometry(gameWidth+ballRadius,gameLength+ballRadius), floorMaterial);
	floor.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2); //rotate 90deg to face horizontally
	if(floorMirror)
		floor.add(floorMirror);
	scene.add(floor);
	
	//Add walls
	var wallMaterial = new THREE.MeshPhongMaterial({"color":0x8F8F8F});
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
	//scene.add(wallGroup);
	
	//Set up block
	block = new THREE.Mesh(new THREE.BoxGeometry(blockWidth,blockHeight,blockLength), blockMaterial);
	blockWall(10); //create wall
	
	//Set up paddle
	paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle.position.y = gameHeight/2;
	paddle.position.z = gameLength/2-20;
	group.add(paddle);
	scene.add(group)
	
	//Set up ball
	addBall();

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
			console.log("checked")
		} else {
			scene.remove(wallGroup);
		}
		$("#wallToggle").blur();
	});
	
	$(window).keypress(function(event) {
		if((event.keyCode == 32 || event.keyCode == 0) && paddle.loadedBall) {
			event.preventDefault();
			paddle.loadedBall.direction.set(Math.random()-0.5, Math.random()-0.5, -0.6).normalize();
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
	// if(!paddle.loadedBall)
		// paddle.position.x = balls[0].position.x;
	requestAnimationFrame(animate);
}

function update(delta) {
	//delta = clock.getDelta();
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
			addBall();
			continue;
			// ball.direction.z = -ball.direction.z;
			// ball.justBounced = false;
			// ball.position.z = gameLength/2;
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
				} else if(!ball.justBounced) { //prevent balls from getting stuck inside the paddle
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = true;
					break;
				}
			} 
			// else if(Math.abs(ball.position.x - paddle.position.x) < paddleWidth+ballRadius && Math.abs(ball.position.z - paddle.position.z) < ballRadius+paddleDepth) {
				// ball.direction.reflect(new THREE.Vector3(0,0,1));
				// ball.justBounced = true;
				// break;
			// }
		}
		ball.position.add(ball.speed.copy(ball.direction).multiplyScalar(delta/5));
	}

}

function loadAppearance(style) {
	if(style.ballGlow) {
		ballShader = new THREE.ShaderMaterial({
			uniforms: 
			{
				"c":   {type: "f", value: 0.9},
				"p":   {type: "f", value: 0.7},
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
	}
	ballMaterial = style.ballMaterial;
	if(style.floorReflection == true) {
		floorMirror = new THREE.Mirror(renderer, camera, { clipBias: 0.03, textureWidth: gameWidth*2, textureHeight: gameLength*2, color: 0x707070 } );
		floorMaterial = floorMirror.material;
		ballCamera = new THREE.CubeCamera(ballRadius, 10000, ballRadius);
		scene.add(ballCamera);
		ballMaterial.envMap = ballCamera.renderTarget;
	} else {
		floorMaterial = style.floorMaterial;
	}
	blockMaterial = style.blockMaterial;
	if(style.blockRefraction == true) {
		blockMaterial.envMap=cubeMapTexture;
		blockMaterial.refractionRatio=0.8;
	}
	paddleMaterial = style.paddleMaterial;
	renderer.setClearColor(style.bgColor);
	if(style.ambientLight) {
		lightingGroup.add(style.ambientLight);
	}
	for(var i = 0; i<style.pointLighting.length; i+=2) {
		var ptLight = style.pointLighting[i];
		ptLight.position.copy(style.pointLighting[i+1]);
		lightingGroup.add(ptLight);
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
}

function blockAt(x, y, z, blockMaterial) {
	var blockCopy = block.clone();
	if(arguments.length == 4) {
		blockCopy.material = blockMaterial;
	}
	blockCopy.isBlock = true;
	blockCopy.position.x = x * (blockWidth+colSpacing) - (blockWidth+colSpacing)*(maxCols-1)/2;
	blockCopy.position.z = z * (blockLength+rowSpacing) - gameLength/2 + blockLength;
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
		
		ball.speed = new THREE.Vector3();
		ball.direction = new THREE.Vector3();//.set(Math.random()-0.5, 0, -0.5).normalize();
		
		paddle.loadedBall = ball;
		group.add(ball);
	}
}