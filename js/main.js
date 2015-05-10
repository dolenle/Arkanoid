
var scene, camera, renderer;

var time, prevTime, controls;
var block, paddle, ball, hitbox;
var balls = [];

var gameLength = 400;
var gameWidth = 300;
var gameHeight = 100;

var blockWidth = 25;
var blockLength = 10;
var blockHeight = 10;
var colSpacing = 3;
var rowSpacing = 5;
var layerSpacing = 3;
var maxCols = Math.floor(gameWidth/(blockWidth+colSpacing));
var maxLayers = Math.floor(gameHeight/(blockHeight+layerSpacing));

var ballRadius = 5;
var paddleWidth = 50;
var paddleDepth = 5;

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

init();
setTimeout( ballRadius, 5000 );
animate();

function init() {
	//Stuff
	//paddleGeometry = new THREE.CylinderGeometry(5,20, gameHeight, 10 );
	paddleGeometry = new THREE.BoxGeometry(paddleWidth, gameHeight, paddleDepth*2);	
	
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	//Set up camera perspective projection
	var aspect = window.innerWidth/window.innerHeight; 
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);
	camera.position.set(0,400,400);
	camera.lookAt(scene.position);
	
	loadAppearance(visualStyles.flat);
	scene.add(lightingGroup);
	
	var urlPrefix = "cubemap/inside1/";
	urls = [ urlPrefix + "0004.png", urlPrefix + "0002.png",
		urlPrefix + "0006.png", urlPrefix + "0005.png",
		urlPrefix + "0001.png", urlPrefix + "0003.png" ];
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( urls[i] ),
			side: THREE.BackSide
		}));
	scene.add(new THREE.Mesh(new THREE.BoxGeometry(8000, 8000, 8000), new THREE.MeshFaceMaterial(materialArray)));
	
	//Add floor
	floor = new THREE.Mesh(new THREE.PlaneGeometry(gameWidth+ballRadius,gameLength+ballRadius), floorMaterial);
	floor.rotateOnAxis(new THREE.Vector3(1,0,0), -1.57); //rotate 90deg to face horizontally
	scene.add(floor);
	
	//Set up block
	block = new THREE.Mesh(new THREE.BoxGeometry(blockWidth,blockHeight,blockLength), blockMaterial);
	blockWall(10); //create wall
	
	//Set up paddle
	paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle.position.y = paddleGeometry.parameters.height/2;
	paddle.position.z = gameLength/2-20;
	group.add(paddle);
	scene.add(group)
	
	//Set up ball
	//Test shader
	ballShader = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1.0 },
			"p":   { type: "f", value: 0.3 },
			glowColor: { type: "c", value: new THREE.Color(0x0022FF) },
			viewVector: { type: "v3", value: camera.position }
		},
		vertexShader: $("#vertexShader").text(),
		fragmentShader: $("#fragmentShader").text(),
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	addBall();

	//Initalize Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI/2;
	document.body.appendChild(renderer.domElement);
	
	document.addEventListener('mousemove', function(event) {
		paddle.position.x = (event.clientX/window.innerWidth) * gameWidth - gameWidth/2;
		if(paddle.loadedBall)
			paddle.loadedBall.position.x = paddle.position.x;
	});
	
	$("#addBall").click(function () {
		addBall();
		$("#addBall").blur();
	});
	
	$(window).keypress(function(event) {
		if((event.keyCode == 32 || event.keyCode == 0) && paddle.loadedBall) {
			event.preventDefault();
			paddle.loadedBall.direction.set(Math.random()-0.5, 0, -0.5).normalize();
			balls.push(paddle.loadedBall);
			paddle.loadedBall = false;
		}
	});
	
	prevTime = performance.now();
}

function animate() {
	time = performance.now();
	renderer.render(scene, camera);
	controls.update();
	update(time-prevTime);
	prevTime = time;
	//if(!paddle.loadedBall)
	//	paddle.position.x = balls[0].position.x;

	requestAnimationFrame(animate);
}

function update(delta) {
	//delta = clock.getDelta();
	for(var b=0; b < balls.length; b++) {
		ball = balls[b];
		if (ball.position.x < -gameWidth/2 || ball.position.x > gameWidth/2) {
			ball.direction.x = -ball.direction.x;
			ball.justBounced = false;
		}
		if(ball.position.z < -gameLength/2) {
			ball.direction.z = -ball.direction.z;
			ball.justBounced = false;
		}
		if(ball.position.z > gameLength/2) {
			balls.splice(b, 1);
			group.remove(ball);
			console.log("NO WRONG");
			continue;
		}
		if(ball.position.y < ballRadius || ball.position.y > gameHeight) {
			ball.direction.y = -ball.direction.y;
			ball.justBounced = false;
		}
		
		// Prevent balls from getting stuck on edges
		ball.position.x = Math.max(-gameWidth/2, Math.min(gameWidth/2, ball.position.x));
		ball.position.z = Math.max(-gameLength/2, Math.min(gameLength/2, ball.position.z));
		ball.position.y = Math.max(ballRadius, Math.min(gameHeight, ball.position.y));
		
		hitbox = ball.children[0];
	
		for(var i = 0; i < hitbox.geometry.vertices.length; i++) {
			var directionVector = hitbox.geometry.vertices[i].clone().add(ball.direction);//applyMatrix4(ball.matrix).sub(ball.position);
			raycaster.set(ball.position, directionVector.clone().normalize() );
			
			var collisionResults = raycaster.intersectObjects(group.children);
			if( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
				var obj = collisionResults[0].object;
				if(obj.isBlock) {
					group.remove(obj);
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = false;
					//break;
				} 
				else if(!ball.justBounced) { //prevent balls from getting stuck inside the paddle
					//ball.position.add(collisionResults[0].face.normal.clone().multiplyScalar(ball.speed.length()*2));
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = true;
					break;
				}
				//break;
			}
		}
		
		ball.position.add(ball.speed.copy(ball.direction).multiplyScalar(delta/9));
	}

}

function loadAppearance(style) {
	floorMaterial = style.floorMaterial;
	ballMaterial = style.ballMaterial;
	blockMaterial = style.blockMaterial;
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
	for(var z = 0; z < rows; z++) {
		var material = blockMaterial.clone();
		material.color.setHex(Math.random() * 0xffffff);
		for(var x = 0; x < maxCols; x++) {
			for(var y = 0; y < maxLayers; y++) {
				blockAt(x,y,z,material);
			}
		}
	} 
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
		var hitbox = new THREE.Mesh(new THREE.BoxGeometry(ballRadius*2/1.7,ballRadius*2/1.7,ballRadius*2/1.7));
		hitbox.visible = false;
		ball.add(hitbox);
		
		var glow = new THREE.Mesh(new THREE.SphereGeometry(ballRadius*1.2, 16), ballShader);
		ball.add(glow);
		
		ball.add(new THREE.PointLight(0x001188));
		
		ball.speed = new THREE.Vector3();
		ball.direction = new THREE.Vector3();//.set(Math.random()-0.5, 0, -0.5).normalize();
		
		paddle.loadedBall = ball;
		group.add(ball);
	}
}