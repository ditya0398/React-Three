import * as React from "react";
import * as THREE from "three"
import {useThree, useFrame} from '@react-three/fiber'
import { useRef } from 'react'
// import the canvas element from r3f
import { Canvas } from "@react-three/fiber";
import Cube from "./Three-Code/Cube";
import LightTracer from "../LightTracer";
const onCreated = (state) => {
  // Access the canvas element and set its ID
  state.gl.domElement.id = 'myCanvasId';
};
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
    <Canvas
     onCreated={onCreated}>
      <LightTracer />
    </Canvas>
    </div>
  );
}