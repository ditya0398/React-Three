import * as THREE from "three"
import {useThree, useFrame} from '@react-three/fiber'
import { useRef } from 'react'
export default function Cube()
{
 
    // const scene = useThree((state) => state.scene)
 
    // const aspect = window.innerWidth / window.innerHeight
    // const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
    // camera.position.set(1, 1, 2)
    // camera.lookAt(0,0,0)
    // scene.add(camera)
    
    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshStandardMaterial({ color: 0x781CE5 })
    // const mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)
    
    // const ambient = new THREE.AmbientLight(0x404040, 5)
    // const point = new THREE.PointLight(0xE4FF00, 1, 10)
    // point.position.set(3, 3, 2)
    // scene.add(ambient)
    // scene.add(point)
    console.log("Hello");
    const ref = useRef();
    useFrame((state, delta, xrFrame) => {
      console.log("I am inside the useFrame");
    });

    return (<Cube/>);
}