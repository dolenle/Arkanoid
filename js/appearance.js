visualStyles = {
	flat: {
		name: "FlatColors",
		bgColor: 0x0F0F0F,
		floorMaterial: new THREE.MeshPhongMaterial({
			"color": 0x606060,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		}),
		ballMaterial: new THREE.MeshPhongMaterial({
			"color": 0x2F0000,
			"emissive": 0x2F0000,
			"specular": 0x009900,
			"shininess": 30
		}),
		ballRandomColor: false,
		blockMaterial: new THREE.MeshPhongMaterial({
			"emissive": 0x090909,
			"specular": 0x0F0F0F,
			"shininess": 10
		}),
		blockRandomColor: true,
		paddleMaterial: new THREE.MeshPhongMaterial({
			"color": 0xFFFFFF
		}),
		ambientLight: new THREE.AmbientLight(0x1F1F1F),
		pointLighting: [
			new THREE.PointLight(0xffffff, 0.5),
			new THREE.Vector3(0,400,0),
			new THREE.PointLight(0xffffff, 1),
			new THREE.Vector3(0,300,400)
		]
	},
	
	glass: {
		name: "Glass",
		bgColor: 0x0F0F0F,
		floorMaterial: new THREE.MeshPhongMaterial({
			"color": 0x606060,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 30
		}),
		ballMaterial: new THREE.MeshPhongMaterial({
			"color": 0x2F0000,
			"emissive": 0x2F0000,
			"specular": 0x009900,
			"shininess": 30,
			"transparent": true,
			"opacity": 0.7
		}),
		ballRandomColor: false,
		blockMaterial: new THREE.MeshPhongMaterial({
			"emissive": 0x090909,
			"specular": 0x0F0F0F,
			"shininess": 10,
			"transparent": true,
			"opacity": 0.5
		}),
		blockRandomColor: true,
		paddleMaterial: new THREE.MeshPhongMaterial({
			"color": 0xFFFFFF,
			"transparent": true,
			"opacity": 0.7
		}),
		ambientLight: new THREE.AmbientLight(0x1F1F1F),
		pointLighting: [
			new THREE.PointLight(0xffffff, 1),
			new THREE.Vector3(0,400,0),
			new THREE.PointLight(0xffffff, 0.5),
			new THREE.Vector3(-200,300,-200)
		]
	}
};