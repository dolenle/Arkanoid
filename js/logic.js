data = [{
   "project":{
      "vr":false
   },
   "camera":{
      "metadata":{
         "version":4.3,
         "type":"Object",
         "generator":"ObjectExporter"
      },
      "object":{
         "uuid":"AF4B7F98-081F-4DE1-922E-F0F7770A9E1D",
         "type":"PerspectiveCamera",
         "name":"Camera",
         "fov":50,
         "aspect":1.536388140161725,
         "near":0.1,
         "far":100000,
         "matrix":[
            0.9999539256095886,
            7.026185883107772e-11,
            0.009601663798093796,
            0,
            0.004474990535527468,
            0.8847509622573853,
            -0.4660426080226898,
            0,
            -0.008495081216096878,
            0.46606409549713135,
            0.8847101926803589,
            0,
            -3.920684814453125,
            215.09982299804688,
            408.3150939941406,
            1
         ]
      }
   },
   "scene":{
      "metadata":{
         "version":4.3,
         "type":"Object",
         "generator":"ObjectExporter"
      },
      "geometries":[
         {
            "uuid":"8F05A1F2-3877-478B-8DFC-F572AC61AB3A",
            "type":"PlaneGeometry",
            "width":300,
            "height":400,
            "widthSegments":1,
            "heightSegments":1
         },
         {
            "uuid":"7149652B-DBD7-4CB7-A600-27A9AC005C95",
            "type":"BoxGeometry",
            "width":20,
            "height":10,
            "depth":10,
            "widthSegments":1,
            "heightSegments":1,
            "depthSegments":1
         },
         {
            "uuid":"CABCC711-1331-4D4C-9FF6-409299F10C68",
            "type":"SphereGeometry",
            "radius":5,
            "widthSegments":32,
            "heightSegments":16,
            "phiStart":0,
            "phiLength":6.28,
            "thetaStart":0,
            "thetaLength":3.14
         },
         {
            "uuid":"A1D8B049-74DD-4B08-B5BC-8DCEC9AF0222",
            "type":"BoxGeometry",
            "width":40,
            "height":10,
            "depth":10,
            "widthSegments":1,
            "heightSegments":1,
            "depthSegments":1
         },
         {
            "uuid":"420E6A60-440B-4C16-BDB9-70A016CBC700",
            "type":"BoxGeometry",
            "width":100,
            "height":100,
            "depth":100,
            "widthSegments":1,
            "heightSegments":1,
            "depthSegments":1
         },
         {
            "uuid":"C13BA21D-2BED-49A7-90A6-ACCA997954C8",
            "type":"BoxGeometry",
            "width":100,
            "height":100,
            "depth":100,
            "widthSegments":1,
            "heightSegments":1,
            "depthSegments":1
         }
      ],
      "materials":[
         {
            "uuid":"2F69AF3A-DDF5-4BBA-87B5-80159F90DDBF",
            "type":"MeshPhongMaterial",
            "color":4079166,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         },
         {
            "uuid":"CFBEAD4C-6695-4A99-887B-8161E2947225",
            "type":"MeshPhongMaterial",
            "color":16777215,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         },
         {
            "uuid":"043B208C-1F83-42C6-802C-E0E35621C27C",
            "type":"MeshPhongMaterial",
            "color":16777215,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         },
         {
            "uuid":"40EC9BDA-91C0-4671-937A-2BCB6DA7EEBB",
            "type":"MeshPhongMaterial",
            "color":13486790,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         },
         {
            "uuid":"BCF16788-50E5-40FF-B2F1-5D0EE019A6CE",
            "type":"MeshPhongMaterial",
            "color":16777215,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         },
         {
            "uuid":"0586E0A4-C180-48CB-BF32-2CC4FF1C72B9",
            "type":"MeshPhongMaterial",
            "color":16777215,
            "emissive":0,
            "specular":1118481,
            "shininess":30
         }
      ],
      "object":{
         "uuid":"31517222-A9A7-4EAF-B5F6-60751C0BABA3",
         "type":"Scene",
         "name":"Scene",
         "matrix":[
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
         ],
         "children":[
            {
               "uuid":"EBBB1E63-6318-4752-AE2E-440A4E0B3EF3",
               "type":"Mesh",
               "name":"Ground",
               "geometry":"8F05A1F2-3877-478B-8DFC-F572AC61AB3A",
               "material":"2F69AF3A-DDF5-4BBA-87B5-80159F90DDBF",
               "matrix":[
                  1.0331928730010986,
                  0,
                  0,
                  0,
                  0,
                  0.0008337644394487143,
                  -1.0470126867294312,
                  0,
                  0,
                  1.0699032545089722,
                  0.0008519928087480366,
                  0,
                  0,
                  0,
                  0,
                  1
               ]
            },
            {
               "uuid":"6EE2E764-43E0-48E0-85F2-E0C8823C20DC",
               "type":"DirectionalLight",
               "name":"DirectionalLight 1",
               "color":16777215,
               "intensity":1,
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  100,
                  200,
                  150,
                  1
               ]
            },
            {
               "uuid":"38219749-1E67-45F2-AB15-E64BA0940CAD",
               "type":"Mesh",
               "name":"Brick",
               "geometry":"7149652B-DBD7-4CB7-A600-27A9AC005C95",
               "material":"CFBEAD4C-6695-4A99-887B-8161E2947225",
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  5,
                  0,
                  1
               ]
            },
            {
               "uuid":"18FFA67C-F893-4E7A-8A76-8D996DEBE0C6",
               "type":"Mesh",
               "name":"Ball",
               "geometry":"CABCC711-1331-4D4C-9FF6-409299F10C68",
               "material":"043B208C-1F83-42C6-802C-E0E35621C27C",
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  5,
                  35.54999923706055,
                  1
               ],
               "children":[
                  {
                     "uuid":"0B6B02B3-7AE3-4048-BBDC-04339D579C16",
                     "type":"HemisphereLight",
                     "name":"HemisphereLight 1",
                     "color":8351,
                     "groundColor":8618883,
                     "matrix":[
                        0.8700000047683716,
                        0,
                        0,
                        0,
                        0,
                        0.8700000047683716,
                        0,
                        0,
                        0,
                        0,
                        0.8700000047683716,
                        0,
                        0,
                        0,
                        0,
                        1
                     ]
                  }
               ]
            },
            {
               "uuid":"6D660D49-39B8-40C3-95F6-E4E007AA8D79",
               "type":"Mesh",
               "name":"Paddle",
               "geometry":"A1D8B049-74DD-4B08-B5BC-8DCEC9AF0222",
               "material":"40EC9BDA-91C0-4671-937A-2BCB6DA7EEBB",
               "matrix":[
                  1.4790643453598022,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  5,
                  159.54217529296875,
                  1
               ]
            },
            {
               "uuid":"B0BEAF69-8B5D-4D87-ADCA-FDE83A02762D",
               "type":"PointLight",
               "name":"PointLight 2",
               "visible":false,
               "color":16777215,
               "intensity":1,
               "distance":0,
               "decay":1,
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  -116.54000091552734,
                  69.48999786376953,
                  -206.82000732421875,
                  1
               ]
            },
            {
               "uuid":"11D9B346-3AE7-45C5-9184-EF0E3EB284BE",
               "type":"Mesh",
               "name":"Box 1",
               "geometry":"420E6A60-440B-4C16-BDB9-70A016CBC700",
               "material":"BCF16788-50E5-40FF-B2F1-5D0EE019A6CE",
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  4.099999904632568,
                  0,
                  205,
                  50,
                  0,
                  1
               ]
            },
            {
               "uuid":"792B29AD-04E1-4783-95C5-845009BBB3C6",
               "type":"Mesh",
               "name":"Box 1",
               "geometry":"420E6A60-440B-4C16-BDB9-70A016CBC700",
               "material":"BCF16788-50E5-40FF-B2F1-5D0EE019A6CE",
               "matrix":[
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  4.099999904632568,
                  0,
                  -205,
                  50,
                  0,
                  1
               ]
            },
            {
               "uuid":"DBB2EE0F-A421-4E43-8B85-2B3D47025FC6",
               "type":"Mesh",
               "name":"Box 2",
               "geometry":"C13BA21D-2BED-49A7-90A6-ACCA997954C8",
               "material":"0586E0A4-C180-48CB-BF32-2CC4FF1C72B9",
               "matrix":[
                  5,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  0,
                  50,
                  -255,
                  1
               ]
            }
         ]
      }
   },
   "scripts":{
      "6D660D49-39B8-40C3-95F6-E4E007AA8D79":[
         {
            "name":"User",
            "source":"function mousemove( event ) {

			this.position.x = ( event.clientX / player.width ) * 300 - 150;

		}

// function update( event ) {}"
         }
      ],
      "31517222-A9A7-4EAF-B5F6-60751C0BABA3":[
         {
            "name":"Game Logic",
            "source":"var ball = this.getObjectByName( 'Ball' );

			var direction = new THREE.Vector3();
			direction.x = Math.random() - 0.5;
			direction.z = - 0.5;
			direction.normalize();

			var speed = new THREE.Vector3();

			//

			var group = new THREE.Group();
			this.add( group );

			var paddle = this.getObjectByName( 'Paddle' );
			group.add( paddle );

			var brick = this.getObjectByName( 'Brick' );

			for ( var j = 0; j < 8; j ++ ) {

				var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );

				for ( var i = 0; i < 12; i ++ ) {
					
					var object = brick.clone();
					object.material = material;
					object.position.x = i * 22 - 120;
					object.position.z = j * 14 - 120;
					group.add( object );
					
				}
				
			}

			brick.visible = false;

			//

			var raycaster = new THREE.Raycaster();

			function update( event ) {
				
				if ( ball.position.x < - 150 || ball.position.x > 150 ) direction.x = - direction.x;
				if ( ball.position.z < - 200 || ball.position.z > 200 ) direction.z = - direction.z;

				ball.position.x = Math.max( - 150, Math.min( 150, ball.position.x ) );
				ball.position.z = Math.max( - 200, Math.min( 200, ball.position.z ) );
				
				ball.position.add( speed.copy( direction ).multiplyScalar( event.delta / 4 ) );
				
				raycaster.set( ball.position, direction );
				
				var intersections = raycaster.intersectObjects( group.children );
				
				if ( intersections.length > 0 ) {
				
					var intersection = intersections[ 0 ];
					
					if ( intersection.distance < 5 ) {
						
						if ( intersection.object !== paddle ) {

							group.remove( intersection.object );
							
						}
						
						direction.reflect( intersection.face.normal );
						
					}
					
				}

			}"
         }
      ]
   }
}];