import * as React from "react";
import * as THREE from "three";
import { Environment } from '@react-three/drei'
// import the canvas element from r3f
import {Stats, OrbitControls, Circle, ContactShadows} from "@react-three/drei"
import { Canvas, useLoader, useThree, useFrame  } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useControls } from "leva"
import { useRef, useMemo, useEffect } from "react";
import { useLayoutEffect } from "react";
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
			import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

import GroundShadowCatcher from "./GroundShadowCatcher";

const meshes = [];

const PLANE_WIDTH = 2.5;
			const PLANE_HEIGHT = 2.5;
			const CAMERA_HEIGHT = 0.3;

			const state = {
				shadow: {
					blur: 3.5,
					darkness: 1,
					opacity: 1,
				},
				plane: {
					color: '#ffffff',
					opacity: 1,
				},
				showWireframe: false,
			};

			let shadowGroup, renderTarget, renderTargetBlur, shadowCamera, cameraHelper, depthMaterial, horizontalBlurMaterial, verticalBlurMaterial;

			let plane, blurPlane, fillPlane;

const circlePositions = [
  [5, 5, 5],
  [-5, 5, 5],
  [5, -5, 5],
  [-5, -5, 5],
];
function ContactShadowsHelper(){
  const {frame , width, height, opacity , scale , blur , far ,near,  resolution , color, position} = useControls("Contact Shadows",{
      frame : 1,
      width: 20,
      height : 20,
      opacity : 1,
      scale : 10,
      blur : 1,
      far : 2,
      near : -0.35,
      resolution : 1024,
      color : "#000000",
      position : {
          value : {x:0,y:0.01,z:0},
          step : 0.01
      }
  })
  return (
      <>
          <ContactShadows
              frame = {frame}
              opacity = {opacity}
              scale = {scale}
              blur = {blur}
              far = {far}
              resolution = {resolution}
              color = {color}
              position = {[position.x,position.y,position.z]}
              near = {near}
              />
      </>
  )
  }
  function LoadRoom()
  {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const gltf = useLoader(GLTFLoader, './room.glb');
     const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    defaultScene.background = texture;
    defaultScene.environment = texture;
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.material.envMap = texture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return(<primitive
      object={gltf.scene}
      position={[0, 0, 0]}
    />
    );
  }
  function LoadModel1()
  {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    console.log("texture");
    const gltf = useLoader(GLTFLoader, './drawer.glb');
    // const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    // defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.material.envMap = texture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return(<primitive
      object={gltf.scene}
      position={[-2, 0, 3]}
    />
    );
  }
  function LoadModel2()
  {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    console.log("texture");
    const gltf = useLoader(GLTFLoader, './Chair.glb');
    // const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    // defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.material.envMap = texture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return(<primitive
      object={gltf.scene}
      position={[0, 0, 3]}
    />
    );
  }
  function LoadModel3()
  {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    console.log("texture");
    const gltf = useLoader(GLTFLoader, './SheenChair.glb');
    // const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    // defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.material.envMap = texture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return(<primitive
      object={gltf.scene}
      position={[-1, 0, 3]}
    />
    );
  }
  function LoadModel4()
  {
    const gltf = useLoader(GLTFLoader, './damaged_helmet.glb');
    // const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    // defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return(<primitive
      object={gltf.scene}
      position={[-1, 0, 3]}
    />
    );
  }
  const CheckScene = React.forwardRef((props, ref) => {
    console.log(ref);
    const gltf = useLoader(GLTFLoader, './drawer.glb');
   if(ref.current)
   {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    console.log("texture");
   
   
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "dimension_geo") {
          child.visible = false;
        }
        child.material.envMap = texture;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    meshes.push(gltf.scene);
    scene.current.add(gltf.scene);
    console.log("Added into the scene");
    // the container, if you need to move the plane just move this
    shadowGroup = new THREE.Group();
    shadowGroup.position.y = - 0.3;
    ref.current.add( shadowGroup );

    // the render target that will show the shadows in the plane texture
    renderTarget = new THREE.WebGLRenderTarget( 512, 512 );
    renderTarget.texture.generateMipmaps = false;

    // the render target that we will use to blur the first render target
    renderTargetBlur = new THREE.WebGLRenderTarget( 512, 512 );
    renderTargetBlur.texture.generateMipmaps = false;


    // make a plane and make it face up
    const planeGeometry = new THREE.PlaneGeometry( PLANE_WIDTH, PLANE_HEIGHT ).rotateX( Math.PI / 2 );
    const planeMaterial = new THREE.MeshBasicMaterial( {
      map: renderTarget.texture,
      opacity: state.shadow.opacity,
      transparent: true,
      depthWrite: false,
    } );
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    // make sure it's rendered after the fillPlane
    plane.renderOrder = 1;
    shadowGroup.add( plane );

    // the y from the texture is flipped!
    plane.scale.y = - 1;

    // the plane onto which to blur the texture
    blurPlane = new THREE.Mesh( planeGeometry );
    blurPlane.visible = false;
    shadowGroup.add( blurPlane );

    // the plane with the color of the ground
    const fillPlaneMaterial = new THREE.MeshBasicMaterial( {
      color: state.plane.color,
      opacity: state.plane.opacity,
      transparent: true,
      depthWrite: false,
    } );
    fillPlane = new THREE.Mesh( planeGeometry, fillPlaneMaterial );
    fillPlane.rotateX( Math.PI );
    shadowGroup.add( fillPlane );

    // the camera to render the depth material from
    shadowCamera = new THREE.OrthographicCamera( - PLANE_WIDTH / 2, PLANE_WIDTH / 2, PLANE_HEIGHT / 2, - PLANE_HEIGHT / 2, 0, CAMERA_HEIGHT );
    shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
    shadowGroup.add( shadowCamera );

    cameraHelper = new THREE.CameraHelper( shadowCamera );

    // like MeshDepthMaterial, but goes from black to transparent
    depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.userData.darkness = { value: state.shadow.darkness };
    depthMaterial.onBeforeCompile = function ( shader ) {

      shader.uniforms.darkness = depthMaterial.userData.darkness;
      shader.fragmentShader = /* glsl */`
        uniform float darkness;
        ${shader.fragmentShader.replace(
      'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
      'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
    )}
      `;

    };

    depthMaterial.depthTest = false;
    depthMaterial.depthWrite = false;

    horizontalBlurMaterial = new THREE.ShaderMaterial( HorizontalBlurShader );
    horizontalBlurMaterial.depthTest = false;

    verticalBlurMaterial = new THREE.ShaderMaterial( VerticalBlurShader );
    verticalBlurMaterial.depthTest = false;

    useFrame(
      ({ gl }) => {gl.autoClear = false;
         
         // remove the background
				const initialBackground = scene.background;
				scene.current.background = null;

				// force the depthMaterial to everything
			//	cameraHelper.visible = false;
				scene.current.overrideMaterial = depthMaterial;

				// set renderer clear alpha
				const initialClearAlpha = gl.getClearAlpha();
				gl.setClearAlpha( 0 );

				// render to the render target to get the depths
				gl.setRenderTarget( renderTarget );
        
				gl.render(scene.current, shadowCamera );

				// and reset the override material
				scene.current.overrideMaterial = null;
				cameraHelper.visible = true;

				blurShadow( state.shadow.blur,gl );

				// a second pass to reduce the artifacts
				// (0.4 is the minimum blur amout so that the artifacts are gone)
				blurShadow( state.shadow.blur * 0.4,gl );

				// reset and render the normal scene
				gl.setRenderTarget( null );
				gl.setClearAlpha( initialClearAlpha );
				scene.current.background = initialBackground;
        gl.render(scene.current, camera)


      },1);
   }
    return(<>
    </>);
  });

  
    
  function blurShadow( amount,renderer ) {

    blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    blurPlane.material = horizontalBlurMaterial;
    blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;

    renderer.setRenderTarget( renderTargetBlur );
    renderer.render( blurPlane, shadowCamera );

    // blur vertically and draw in the main renderTarget
    blurPlane.material = verticalBlurMaterial;
    blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;

    renderer.setRenderTarget( renderTarget );
    renderer.render( blurPlane, shadowCamera );

    blurPlane.visible = false;

  }

  
  function MainScene({ camera }) {
    const scene = useRef();
    useFrame(
      ({ gl }) => {gl.autoClear = false;
         
       
        gl.render(scene.current, camera)


      },1);
    return (
      <>
      <scene ref={scene}>
      <CheckScene ref={scene}/>
      
      </scene>
      
        </>
    );
  }
  function HeadsUpDisplay({ camera }) {
    const scene = useRef()
    useFrame(({ gl }) => void ((gl.autoClear = false), gl.render(scene.current, camera)), 10)
    return(<> <scene ref={scene}>
      
       <LoadRoom/>
      </scene>
      </>
  )}
 function MultipleScenes()
 {
  const camera = useRef();
  const { size, setDefaultCamera } = useThree();
  const set = useThree(({ set }) => set);
  useLayoutEffect(() => {
    set({ camera: camera.current });
  }, []);
  return (
    <>
      <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[0, 0, 50]}
        onUpdate={(self) => self.updateProjectionMatrix()}
      />
      {camera.current && (
        <group>
          <MainScene camera={camera.current} />
         
        </group>
      )}
    </>
  );
 }
export default function App() {
  return (
    <div
    style={{
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
    }}
  >
    <Canvas shadows>
    <MultipleScenes/>
      <OrbitControls target={[0, 1, 0]} />
      
      <Stats />
    </Canvas>
    </div>
  );
}