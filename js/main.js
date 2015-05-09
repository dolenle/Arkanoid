
var scene, camera, renderer;

var controls;
var block, colSpacer, paddle, ball;

var ballRadius = 5;

var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();
var speed = new THREE.Vector3();
var direction = new THREE.Vector3();
var group = new THREE.Group();

init();
setTimeout( ballRadius, 5000 );
animate();

function init() {
	scene = new THREE.Scene();
	
	//Set up camera perspective projection
	var aspect = window.innerWidth/window.innerHeight; 
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);
	
	//Set up lighting
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0,250,0);
	scene.add(pointLight);
	var ambientLight = new THREE.AmbientLight(0x1C1C1C);
	scene.add(ambientLight);
	
	//Add ground
	ground = new THREE.Mesh(new THREE.PlaneGeometry(300+ballRadius,400+ballRadius), new THREE.MeshPhongMaterial({
		"color": 86015,
		"emissive": 0,
		"specular": 1118481,
		"shininess": 30
	}));
	ground.rotateOnAxis(new THREE.Vector3(1,0,0), -1.57);
	scene.add(ground);
	
	//Set up block
	block = new THREE.Mesh(new THREE.BoxGeometry(20,10,10), new THREE.MeshPhongMaterial());
	block.position.y = 5;
	block.isRemoved = false;
	colSpacer = new THREE.Mesh(new THREE.BoxGeometry(2,10,10), new THREE.MeshBasicMaterial());
	colSpacer.position.y = 5;
	//block.updateMatrix();
	addBlocks(19); //create wall
	
	//Set up paddle
	var paddleGeom = new THREE.BoxGeometry(40,10,10);
	paddle = new THREE.Mesh(paddleGeom, new THREE.MeshPhongMaterial());
	paddle.position.set(0, 5, 150);
	group.add(paddle);
	scene.add(group)
	//scene.add(paddle);
	
	//Set up ball
	ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius), new THREE.MeshPhongMaterial());
	ball.position.y = ballRadius;
	ball.position.z = paddle.position.z-ballRadius-5;
	scene.add(ball);
	
	direction.set(Math.random()-0.5, 0, -0.5).normalize();

	//Initalize WebGL
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0x0F0F0F);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = Math.PI/2;
	document.body.appendChild(renderer.domElement);
	
	document.addEventListener('mousemove', function(event) {
		paddle.position.x = (event.clientX/window.innerWidth) * 300 - 150;
	});
}

function animate() {

	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	controls.update();
	update();
	paddle.position.x = ball.position.x;
}

function update() {
	
	var delta = clock.getDelta();
	
	if ( ball.position.x < - 150 || ball.position.x > 150 ) direction.x = - direction.x;
	if ( ball.position.z < - 200 || ball.position.z > 200 ) direction.z = - direction.z;

	ball.position.x = Math.max( - 150, Math.min( 150, ball.position.x ) );
	ball.position.z = Math.max( - 200, Math.min( 200, ball.position.z ) );
	
	ball.position.add( speed.copy( direction ).multiplyScalar(delta*100) );
	
	raycaster.set( ball.position, direction );
	
	var intersections = raycaster.intersectObjects( group.children );
	
	if ( intersections.length > 0 ) {
	
		var intersection = intersections[ 0 ];
		
		if ( intersection.distance < ballRadius ) {
			var obj = intersection.object;
			if (obj !== paddle ) {
				group.remove(obj);
				if(obj.isSpacer) {
					group.remove(obj.leftBlock)
					group.remove(obj.rightBlock)
				}
			}
			if(!obj.isSpacer || (obj.leftBlock.isRemoved && obj.rightBlock.isRemoved)) {
				direction.reflect( intersection.face.normal );
			}
			
		}
		
	}

}

function addBlocks(rows) {

	for (var y = 0; y < rows; y++) {
		var material = new THREE.MeshPhongMaterial({
			"color": Math.random() * 0xffffff,
			"emissive": 9000,
			"specular": 1118481,
			"shininess": 90
		});
		var lastSpacer;
		for (var x = 0; x < 12; x++) {
			var copy = block.clone();
			copy.material = material;
			copy.position.x = x * 22 - 120;
			copy.position.z = y * 14 - 150;		
			if(x != 0) {
				lastSpacer.rightBlock = copy;
				copy.leftSpacer = lastSpacer;
			}
			group.add(copy);
			
			if(x != 11) {
				var spacer = colSpacer.clone();
				spacer.visible = false;
				spacer.isSpacer = true;
				spacer.leftBlock = copy;
				copy.rightSpacer = spacer;
				lastSpacer = spacer;
				spacer.position.x = x * 22 - 109;
				spacer.position.z = copy.position.z;
				group.add(spacer);
			}
		}
	}
}