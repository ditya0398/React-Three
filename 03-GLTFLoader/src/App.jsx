import * as React from "react";
// import the canvas element from r3f
import {Stats, OrbitControls, Circle, ContactShadows} from "@react-three/drei"
import { Canvas, useLoader, useThree  } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useControls } from "leva"


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


  function LoadModel()
  {
    const { scene } = useLoader(GLTFLoader, './room.glb');
    const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
   
   scene.position.x = 3;
    defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    
    return(<> 
    </>
    );

  }

  function LoadModel1()
  {
   
    const { scene } = useLoader(GLTFLoader, './drawer.glb');
    const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    
    return(<> 
    </>
    );

  }

  function LoadModel2()
  {
   
    const { scene } = useLoader(GLTFLoader, './Chair.glb');
    const { scene: defaultScene } = useThree(); // This is the main scene from the r3f context
    defaultScene.add(scene);
    //const gltf = useLoader(GLTFLoader, './drawer.glb')
    
    return(<> 
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
    <directionalLight position={[3.3, 1.0, 4.4]} castShadow />
    <ContactShadowsHelper/>
    <LoadModel/>
    <LoadModel1/>
    <LoadModel2/>
      
      <OrbitControls target={[0, 1, 0]} />
      <axesHelper args={[5]} />
      <Stats />

    </Canvas>
    </div>
  );
}