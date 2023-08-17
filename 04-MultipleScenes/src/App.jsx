import * as React from "react";
import * as THREE from "three";
import {Stats, OrbitControls, Circle, ContactShadows} from "@react-three/drei"
import { Canvas, useLoader, useThree, useFrame  } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { useRef } from "react";
import { useLayoutEffect } from "react";

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
  function LoadDrawer()
  {

    
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./pic.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const gltf = useLoader(GLTFLoader, './drawer.glb');
    
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
    const scene = useRef();
    useFrame(
      ({ gl }) => void ((gl.autoClear = false), gl.render(scene.current, camera)),
      true
    );
    return (
      <scene ref={scene}>
          <directionalLight position={[3.3, 1.0, 4.4]}  shadow-mapSize-width = {2048} shadow-mapSize-height = {2048}
  castShadow />
  
       <LoadDrawer/>
      </scene>
    );
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