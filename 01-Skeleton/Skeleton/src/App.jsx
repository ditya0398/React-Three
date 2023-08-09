import * as React from "react";
// import the canvas element from r3f
import { Canvas } from "@react-three/fiber";

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
    // create the canvas
    <Canvas>
      // create an ambient light
      <ambientLight />
      
      // create a pointlight and give it a position
      <pointLight position={[10, 10, 10]} />
    
      // create a mess and rotate it slightly
      <mesh rotation={[10, 15, 6]}>
          
        // create a box geometry of a size of 2 on all axis 
        <boxGeometry args={[2, 2, 2]} />
            
        // give the mesh the standard pbr material with preset color of hotpink
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
    </div>
  );
}