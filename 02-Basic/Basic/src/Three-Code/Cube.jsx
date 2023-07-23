import * as THREE from "three";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { ProgressiveLightMap } from 'three/addons/misc/ProgressiveLightMap.js';

import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
export default function Cube() {
  // ShadowMap + LightMap Res and Number of Directional Lights
  const shadowMapRes = 512,
    lightMapRes = 1024,
    lightCount = 8;
  let camera,controls,
    control,
    control2,
    object = new THREE.Mesh(),
    lightOrigin = null,
    progressiveSurfacemap;
  const dirLights = [],
    lightmapObjects = [];
  const params = {
    Enable: true,
    "Blur Edges": true,
    "Blend Window": 200,
    "Light Radius": 50,
    "Ambient Weight": 0.5,
    "Debug Lightmap": false,
  };

  const scene = useThree((state) => state.scene);
  const renderer = useThree((state) => state.gl);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.useLegacyLights = true;
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  // camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 100, -700);
  camera.name = "Camera";

  // scene

  scene.background = new THREE.Color(0x949494);
  scene.fog = new THREE.Fog(0x949494, 1000, 3000);

  // progressive lightmap
  progressiveSurfacemap = new ProgressiveLightMap(renderer, lightMapRes);

  // directional lighting "origin"
  lightOrigin = new THREE.Group();
  lightOrigin.position.set(60, 150, 100);
  scene.add(lightOrigin);

  // transform gizmo
  control = new TransformControls(camera, renderer.domElement);
  control.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });
  control.attach(lightOrigin);
  scene.add(control);

  // create 8 directional lights to speed up the convergence
  for (let l = 0; l < lightCount; l++) {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0 / lightCount);
    dirLight.name = "Dir. Light " + l;
    dirLight.position.set(200, 200, 200);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 100;
    dirLight.shadow.camera.far = 5000;
    dirLight.shadow.camera.right = 150;
    dirLight.shadow.camera.left = -150;
    dirLight.shadow.camera.top = 150;
    dirLight.shadow.camera.bottom = -150;
    dirLight.shadow.mapSize.width = shadowMapRes;
    dirLight.shadow.mapSize.height = shadowMapRes;
    lightmapObjects.push(dirLight);
    dirLights.push(dirLight);
  }

  // ground
  const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: true })
  );
  groundMesh.position.y = -0.9;
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.name = "Ground Mesh";
  lightmapObjects.push(groundMesh);
  scene.add(groundMesh);

  console.log("Hello");
  const ref = useRef();
 
  // model
  function loadModel() {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.name = "Loaded Mesh";
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhongMaterial();

        // This adds the model to the lightmap
        lightmapObjects.push(child);
        progressiveSurfacemap.addObjectsToLightMap(lightmapObjects);
      } else {
        child.layers.disableAll(); // Disable Rendering for this
      }
    });
    scene.add(object);
    object.scale.set(1, 1, 1);
    object.position.set(0, -16, -80);
    // control2 = new TransformControls(camera, renderer.domElement);
    // control2.addEventListener("dragging-changed", (event) => {
    //   controls.enabled = !event.value;
    // });
    // control2.attach(object);
    // scene.add(control2);
    const lightTarget = new THREE.Group();
    lightTarget.position.set(0, 20, 0);
    for (let l = 0; l < dirLights.length; l++) {
      dirLights[l].target = lightTarget;
    }

    object.add(lightTarget);

    if (typeof TESTING !== "undefined") {
      for (let i = 0; i < 300; i++) {
     //   controls.update();
        if ( params[ 'Enable' ] ) {

					progressiveSurfacemap.update( camera, params[ 'Blend Window' ], params[ 'Blur Edges' ] );

					if ( ! progressiveSurfacemap.firstUpdate ) {

						progressiveSurfacemap.showDebugLightmap( params[ 'Debug Lightmap' ] );

					}

				}
       // Manually Update the Directional Lights
				for ( let l = 0; l < dirLights.length; l ++ ) {

					// Sometimes they will be sampled from the target direction
					// Sometimes they will be uniformly sampled from the upper hemisphere
					if ( Math.random() > params[ 'Ambient Weight' ] ) {

						dirLights[ l ].position.set(
							lightOrigin.position.x + ( Math.random() * params[ 'Light Radius' ] ),
							lightOrigin.position.y + ( Math.random() * params[ 'Light Radius' ] ),
							lightOrigin.position.z + ( Math.random() * params[ 'Light Radius' ] ) );

					} else {

						// Uniform Hemispherical Surface Distribution for Ambient Occlusion
						const lambda = Math.acos( 2 * Math.random() - 1 ) - ( 3.14159 / 2.0 );
						const phi = 2 * 3.14159 * Math.random();
						dirLights[ l ].position.set(
							        ( ( Math.cos( lambda ) * Math.cos( phi ) ) * 300 ) + object.position.x,
							Math.abs( ( Math.cos( lambda ) * Math.sin( phi ) ) * 300 ) + object.position.y + 20,
							          ( Math.sin( lambda ) * 300 ) + object.position.z
						);

					}

				}
      }
    }
  }

  const manager = new THREE.LoadingManager(loadModel);
  const loader = new GLTFLoader(manager);
  loader.load("ShadowmappableMesh.glb", function (obj) {
    object = obj.scene.children[0];
  });

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 1.5;
  controls.target.set(0, 100, 0);
  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  window.addEventListener( 'resize', onWindowResize );
  
  const gui = new GUI( { name: 'Accumulation Settings' } );
  gui.add( params, 'Enable' );
  gui.add( params, 'Blur Edges' );
  gui.add( params, 'Blend Window', 1, 500 ).step( 1 );
  gui.add( params, 'Light Radius', 0, 200 ).step( 10 );
  gui.add( params, 'Ambient Weight', 0, 1 ).step( 0.1 );
  gui.add( params, 'Debug Lightmap' );

  useFrame((state, delta, xrFrame) => {
    console.log("I am inside the useFrame of CubeJSX");
    // Update the inertia on the orbit controls
   // controls.update();
    if ( params[ 'Enable' ] ) {

      progressiveSurfacemap.update( camera, params[ 'Blend Window' ], params[ 'Blur Edges' ] );

      if ( ! progressiveSurfacemap.firstUpdate ) {

        progressiveSurfacemap.showDebugLightmap( params[ 'Debug Lightmap' ] );

      }

    }
      // Manually Update the Directional Lights
				for ( let l = 0; l < dirLights.length; l ++ ) {

					// Sometimes they will be sampled from the target direction
					// Sometimes they will be uniformly sampled from the upper hemisphere
					if ( Math.random() > params[ 'Ambient Weight' ] ) {

						dirLights[ l ].position.set(
							lightOrigin.position.x + ( Math.random() * params[ 'Light Radius' ] ),
							lightOrigin.position.y + ( Math.random() * params[ 'Light Radius' ] ),
							lightOrigin.position.z + ( Math.random() * params[ 'Light Radius' ] ) );

					} else {

						// Uniform Hemispherical Surface Distribution for Ambient Occlusion
						const lambda = Math.acos( 2 * Math.random() - 1 ) - ( 3.14159 / 2.0 );
						const phi = 2 * 3.14159 * Math.random();
						dirLights[ l ].position.set(
							        ( ( Math.cos( lambda ) * Math.cos( phi ) ) * 300 ) + object.position.x,
							Math.abs( ( Math.cos( lambda ) * Math.sin( phi ) ) * 300 ) + object.position.y + 20,
							          ( Math.sin( lambda ) * 300 ) + object.position.z
						);

					}

				}
    renderer.render(scene, camera);
    // console.log("Finished rendering");
  });
}
