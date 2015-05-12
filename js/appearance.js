visualStyles = {
	flat: {
		name: "FlatColors",
		bgColor: 0x0F0F0F,
		floorMaterial: new THREE.MeshBasicMaterial({
				"color": (Math.random()/7)*0xFFFFFF
		}),
		ballMaterial: new THREE.MeshPhongMaterial({
			"color": (Math.random())*0xFFFFFF,
			"emissive": 0,
			"specular": 0,
			"shininess": 30
		}),
		ballGlow: false,
		blockMaterial: new THREE.MeshPhongMaterial({
			"emissive": 0x090909,
			"specular": 0x0F0F0F,
			"shininess": 10
		}),
		blockRefraction: false,
		paddleMaterial: new THREE.MeshPhongMaterial({
			"color": 0xFFFFFF
		}),
		ambientLight: new THREE.AmbientLight(0x8F8F8F),
		pointLighting: [
			new THREE.PointLight(0xffffff, 0.5),
			new THREE.Vector3(0,400,0),
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
			"color": 0x001C6F,
			"emissive": 0x2F0000,
			"specular": 0x009900,
			"shininess": 30,
			"transparent": true,
			"opacity": 0.7
		}),
		ballGlow: true,
		blockMaterial: new THREE.MeshPhongMaterial({
			"emissive": 0x090909,
			"specular": 0x0F0F0F,
			"shininess": 10,
			"transparent": true,
			"opacity": 0.5
		}),
		blockRefraction: false,
		paddleMaterial: new THREE.MeshPhongMaterial({
			"color": 0xFFFFFF,
			"transparent": true,
			"opacity": 0.8
		}),
		ambientLight: new THREE.AmbientLight(0x1F1F1F),
		pointLighting: [
			new THREE.PointLight(0xffffff, 1),
			new THREE.Vector3(0,400,0),
			new THREE.PointLight(0xffffff, 0.5),
			new THREE.Vector3(-200,300,-200)
		]
	},
	
	mirror: {
		name: "Mirror",
		bgColor: 0x0A0A0A,
		floorMaterial: new THREE.MeshPhongMaterial({
			"color": 0x181818,
			"specular": 0x111111,
			"shininess": 30,
		}),
		floorReflection: true,
		ballMaterial: new THREE.MeshPhongMaterial({
			"color": 0xFFFFFF,
			"specular": 0x002908
		}),
		ballGlow: false,
		blockMaterial: new THREE.MeshPhongMaterial({
			"specular": 0x0F0F0F,
			"emissive": 0x0A0A0A,
			"shininess": 50,
		}),
		blockRefraction: true,
		paddleMaterial: new THREE.MeshPhongMaterial({
			"color": 0x1B1B1B,
			"transparent": true,
			"opacity": 0.85
		}),
		ambientLight: new THREE.AmbientLight(0x1F1F1F),
		pointLighting: [
			new THREE.PointLight(0xffffff, 1),
			new THREE.Vector3(0,400,0),
			new THREE.HemisphereLight(0xffffff, 0.3),
			new THREE.Vector3(-200,300,-200)
		]
	}
}; 