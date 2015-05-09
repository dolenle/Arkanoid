
var scene, camera, renderer;

var time, prevTime, controls;
var block, paddle, ball, hitbox;
var balls = [];

var gameLength = 400;
var gameWidth = 200;
var gameHeight = 100;

var blockWidth = 25;
var blockLength = 10;
var blockHeight = 10;
var colSpacing = 3;
var rowSpacing = 5;
var layerSpacing = 3;
var maxCols = Math.floor(gameWidth/(blockWidth+colSpacing));
var maxLayers = Math.floor(gameHeight/(blockHeight+rowSpacing));

var ballRadius = 5;

var raycaster = new THREE.Raycaster();

var group = new THREE.Group();

init();
setTimeout( ballRadius, 5000 );
animate();

function init() {
	scene = new THREE.Scene();
	
	//Set up camera perspective projection
	var aspect = window.innerWidth/window.innerHeight; 
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);
	camera.position.set(0,400,400);
	camera.lookAt(scene.position);
	
	//Set up lighting
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0,250,0);
	scene.add(pointLight);
	var ambientLight = new THREE.AmbientLight(0x1C1C1C);
	scene.add(ambientLight);
	
	//Add floor
	floor = new THREE.Mesh(new THREE.PlaneGeometry(gameWidth+ballRadius,gameLength+ballRadius), new THREE.MeshPhongMaterial({
		"color": 0x6A6A6A,
		"emissive": 0,
		"specular": 1118481,
		"shininess": 30
	}));
	floor.rotateOnAxis(new THREE.Vector3(1,0,0), -1.57); //rotate 90deg to face horizontally
	scene.add(floor);
	
	//Set up block
	block = new THREE.Mesh(new THREE.BoxGeometry(blockWidth,blockHeight,blockLength), new THREE.MeshPhongMaterial());
	addBlocks(19); //create wall
	
	//Set up paddle
	var paddleGeom = new THREE.BoxGeometry(40, gameHeight, 10 );
	paddle = new THREE.Mesh(paddleGeom, new THREE.MeshPhongMaterial());
	paddle.position.y = paddleGeom.parameters.height/2;
	paddle.position.z = gameLength/2-20;
	group.add(paddle);
	scene.add(group)
	//scene.add(paddle);
	
	//Set up ball
	addBall();

	//Initalize WebGL
	renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setClearColor(0x0F0F0F);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
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
		if(event.keyCode == 32 && paddle.loadedBall) {
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
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	controls.update();
	update(time-prevTime);
	prevTime = time;
	//paddle.position.x = balls[0].position.x;
}

function update(delta) {
	//delta = clock.getDelta();
	for(var b=0; b < balls.length; b++) {
		ball = balls[b];
		if (ball.position.x < -gameWidth/2 || ball.position.x > gameWidth/2) {
			ball.direction.x = -ball.direction.x;
			ball.justBounced = false;
		}
		if(ball.position.z < -gameLength/2 || ball.position.z > gameLength/2) {
			ball.direction.z = -ball.direction.z;
			ball.justBounced = false;
		}
		if(ball.position.y < ballRadius || ball.position.y > gameHeight) {
			ball.direction.y = -ball.direction.y;
			ball.justBounced = false;
		}
		
		// Prevent balls from getting stuck on edges
		ball.position.x = Math.max(-gameWidth/2, Math.min(gameWidth/2, ball.position.x));
		ball.position.z = Math.max(-200, Math.min(200, ball.position.z));
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
				} else if(!ball.justBounced) { //prevent balls from getting stuck inside the paddle
					//ball.position.add(collisionResults[0].face.normal.clone().multiplyScalar(ball.speed.length()*2));
					ball.direction.reflect(collisionResults[0].face.normal);
					ball.justBounced = true;
					//break;
				}
				//break;
			}
		}
		ball.position.add(ball.speed.copy(ball.direction).multiplyScalar(delta/4));
	}

}

function addBlocks(rows) {
	for(var z = 0; z < rows; z++) {
		var material = new THREE.MeshPhongMaterial({
			"color": Math.random() * 0xffffff,
			"emissive": 0x090909,
			"specular": 0x0F0F0F,
			"shininess": 3
		});
		for(var x = 0; x < maxCols; x++) {
			for(var y = 0; y < maxLayers; y++) {
				var copy = block.clone();
				copy.material = material;
				copy.isBlock = true;
				copy.position.x = x * (blockWidth+colSpacing) - (blockWidth+colSpacing)*(maxCols-1)/2;
				copy.position.z = z * (blockLength+rowSpacing) - gameLength/2 + blockLength;
				copy.position.y = y * (blockHeight+layerSpacing) + blockHeight/2;		
				group.add(copy);
			}
		}
	}
}

function addBall() {
	if(!paddle.loadedBall) {
		var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 16), new THREE.MeshPhongMaterial());
		ball.position.y = ballRadius;
		ball.position.x = paddle.position.x;
		ball.position.z = paddle.position.z-ballRadius-5;
		ball.justBounced = false;
		
		//x = diameter/sqrt(3) THREE.DodecahedronGeometry(ballRadius));
		var hitbox = new THREE.Mesh(new THREE.BoxGeometry(ballRadius*2/1.7,ballRadius*2/1.7,ballRadius*2/1.7));
		hitbox.visible = false;
		ball.add(hitbox);
		
		ball.speed = new THREE.Vector3();
		ball.direction = new THREE.Vector3();//.set(Math.random()-0.5, 0, -0.5).normalize();
		
		paddle.loadedBall = ball;
		group.add(ball);
	}
}