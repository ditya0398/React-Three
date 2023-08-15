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

    console.log(texture);
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
    var texture = textureLoader.load('./gymHdri.exr');
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
    const gltf = useLoader(GLTFLoader, './Chair.glb');
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
      position={[0, 0, 3]}
    />
    );
  }
  function LoadModel3()
  {
    const gltf = useLoader(GLTFLoader, './monkey.glb');
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
      position={[0, 0, 3]}
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
  function MainScene({ camera }) {
    const scene = useRef();
    useFrame(
      ({ gl }) => void ((gl.autoClear = false), gl.render(scene.current, camera)),
      true
    );
    return (
      <scene ref={scene}>
       
       <LoadRoom/>
      </scene>
    );
  }

 /* <directionalLight position={[3.3, 1.0, 4.4]}  shadow-mapSize-width = {2048} shadow-mapSize-height = {2048}
  castShadow />*/
  
  function HeadsUpDisplay({ camera }) {
    const sceneRef = useRef();
    const sceneMemoized = useMemo(() => {
      const scene = new THREE.Scene();
      const gltf = useLoader(GLTFLoader, './drawer.glb');
      gltf.scene.z = 3;
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
    scene.add(gltf.scene);
      return(scene);
    }, []);
    useEffect(() => {
      if (sceneRef.current) {
        sceneRef.current.copy(sceneMemoized, true);
        sceneRef.current.updateMatrixWorld(true);
       
      }
    }, []);
    useFrame(
      ({ gl }) =>
        void ((gl.autoClear = false), gl.render(sceneRef.current, camera))
    );
    return <scene ref={sceneRef} />;
  }
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
          <HeadsUpDisplay camera={camera.current} />
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
    <Canvas>
   
    <MultipleScenes/>
      <OrbitControls target={[0, 1, 0]} />
      <axesHelper args={[5]} />
      <Stats />
    </Canvas>
    </div>
  );
}