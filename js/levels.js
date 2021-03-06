levels = [
	{
		name: "An Easy Start",
		gameLength: 300,
		gameWidth: 250,
		gameHeight: 15,
		blockWidth: 40,
		blockLength: 15,
		blockHeight: 15,
		colSpacing: 5,
		rowSpacing: 5,
		rows: 4,
		rearSpace: 50,
		layerSpacing: 0,
		ballRadius: 5,
		paddleWidth: 50,
		paddleDepth: 5,
		paddleGeometry: function() {
			return new THREE.BoxGeometry(this.paddleWidth, this.gameHeight, this.paddleDepth*2);
		},
		initialBalls: 3,
		initialSpeedFactor: 5.5,
		speedThreshold: 0.12,
		speedRatio: 0.96,
		maxSpeedFactor: 3.5,
		initialBallDirection: new THREE.Vector3(Math.random()-0.5, 0, -0.7)
	},
	{
		name: "A New Dimension",
		gameLength: 200,
		gameWidth: 250,
		gameHeight: 80,
		blockWidth: 25,
		blockLength: 10,
		blockHeight: 10,
		colSpacing: 4,
		rowSpacing: 5,
		rows: 1,
		rearSpace: 20,
		layerSpacing: 4,
		ballRadius: 5,
		paddleWidth: 55,
		paddleDepth: 5,
		paddleGeometry: function() {
			var paddleGeometry = new THREE.Geometry();
			paddleGeometry.vertices.push(
				new THREE.Vector3(-this.paddleWidth/2,  this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(-this.paddleWidth/2+10,  this.gameHeight/2, -this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2,  this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2-10,  this.gameHeight/2, -this.paddleDepth),
				
				new THREE.Vector3(-this.paddleWidth/2,  -this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(-this.paddleWidth/2+10,  -this.gameHeight/2, -this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2,  -this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2-10,  -this.gameHeight/2, -this.paddleDepth)
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
			return paddleGeometry;
		},
		initialBalls: 5,
		initialSpeedFactor: 6,
		speedThreshold: 0.16,
		speedRatio: 0.94,
		maxSpeedFactor: 3,
		initialBallDirection: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, -0.6)
	},
	{
		name: "A Big Ball",
		gameLength: 300,
		gameWidth: 300,
		gameHeight: 80,
		blockWidth: 25,
		blockLength: 10,
		blockHeight: 10,
		colSpacing: 4,
		rowSpacing: 5,
		rows: 6,
		rearSpace: 20,
		layerSpacing: 4,
		ballRadius: 10,
		paddleWidth: 70,
		paddleDepth: 5,
		paddleGeometry: function() {
			var paddleGeometry = new THREE.Geometry();
			paddleGeometry.vertices.push(
				new THREE.Vector3(-this.paddleWidth/2,  this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(-this.paddleWidth/2+15,  this.gameHeight/2, -this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2,  this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2-15,  this.gameHeight/2, -this.paddleDepth),
				
				new THREE.Vector3(-this.paddleWidth/2,  -this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(-this.paddleWidth/2+15,  -this.gameHeight/2, -this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2,  -this.gameHeight/2, this.paddleDepth),
				new THREE.Vector3(this.paddleWidth/2-15,  -this.gameHeight/2, -this.paddleDepth)
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
			return paddleGeometry;
		},
		initialBalls: 5,
		initialSpeedFactor: 6,
		speedThreshold: 0.1,
		speedRatio: 0.92,
		maxSpeedFactor: 3.5,
		initialBallDirection: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, -0.6)
	}
];