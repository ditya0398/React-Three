import * as React from "react";
import * as THREE from "three"
import {useThree, extend, useFrame} from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import the canvas element from r3f
import { Canvas } from "@react-three/fiber";
import Cube from "./Three-Code/Cube";


extend({ OrbitControls })

function Controls() {
  const controls = useRef()
  const { camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
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
    <Controls />
      <Cube/>
     
    </Canvas>
    </div>
  );
}