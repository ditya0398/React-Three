import LightTracerApi, { default as LighTracerApi } from './ltapi'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';


const setupScene = ({ gltfModel, api, glApiRenderer, scene, camera, renderer }: any) => {

    function exportToGLB(input: any, callback: any) {
        new GLTFExporter().parse(
            input,
            (result: any) => callback(result),
            (error: any) => {
                console.log('An error happened during parsing', error);
            },
            { binary: true },
        );

    }

    function createBuffer(typedarray: any) {
        console.assert(typedarray.buffer instanceof ArrayBuffer);
        console.assert(typedarray.byteLength > 0);

        if (api.HEAPU32.buffer == typedarray.buffer) {
            // eslint-disable-next-line no-param-reassign
            typedarray = new Uint8Array(typedarray);
        }
        const ta = typedarray;
        // eslint-disable-next-line new-cap
        const bd = new api.internal$BufferDescriptor(ta.byteLength);
        const uint8array = new Uint8Array(ta.buffer, ta.byteOffset, ta.byteLength);
        bd.getBytes().set(uint8array);
        return bd;
    }

    // const scene = useThree((state) => state.scene);
    // const camera = useThree((state) => state.camera);
    // const renderer = useThree((state) => state.gl);
    // let cameraPreviousMatrix;
    // useEffect(() => {
    //     // Access the camera's matrix
    //     cameraPreviousMatrix = camera.matrixWorld;
    //     // Use the camera matrix as needed
    //     console.log('Camera Matrix:', cameraPreviousMatrix);
    // }, [camera]);


    const geometry = new THREE.TorusKnotGeometry(18, 7, 300, 40);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
    });


    let torusMesh = new THREE.Mesh(geometry, material);
    torusMesh.name = "Torus";
    scene.add(torusMesh);
    console.log("Added the torus mesh");

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();


    const exrPath = new URL('./resources/piz_compressed.exr', import.meta.url)
        .href;

    new EXRLoader().load(exrPath, (texture: any) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;


        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        torusMesh.material.envMap = envMap;
        torusMesh.material.needsUpdate = true;
        scene.background = texture;
        //scene.environment = envMap;
    });

    exportToGLB(torusMesh, (buffer: any) => {
        const sceneDataBuffer = createBuffer(new Uint8Array(buffer));
        console.log("before load scene from buffer");
        console.log("MY API", glApiRenderer);
        glApiRenderer.loadSceneFromBuffer(sceneDataBuffer);
        console.log("After laod scene from buffer")
        sceneDataBuffer.delete();
    });




    // Load env map to LT
    fetch(exrPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
            const buffer = createBuffer(new Uint8Array(arrayBuffer));
            glApiRenderer.loadEnvironmentMapFromBuffer(buffer);
            buffer.delete();
        });


    return null;
};


const LightTracer = ({ gltfModel }: any) => {
    let useLT = true;
    let view: any;
    const [glApiRendererFromLightTracer, setGlApiRendererFromLightTracer] = useState<any>({})
    const [cameraPreviousMatrix, setcameraPreviousMatrix] = useState<any>({})
    const [viewFromLightTracer, setViewFromLightTracer] = useState<any>({})
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);
    const gl = useThree((state) => state.gl);

    useEffect(() => {
        LightTracerApi()
            .then((api: any) => {
                console.log('inside api')
                const floatLinearExt = gl.getContext().getExtension('OES_texture_float_linear');
                gl.getContext().getExtension('EXT_color_buffer_float');

                console.log("Before API", gl.domElement.id);
                const glApiRenderer = new api.Renderer('#myCanvasId', "LT_APP_TOKEN");
                console.log("AFTER API", glApiRenderer);
                glApiRenderer.setFloatTextureInterpolationSupport(
                    floatLinearExt !== null
                );

                setGlApiRendererFromLightTracer(glApiRenderer)
                console.log(glApiRendererFromLightTracer);

                const ctx = glApiRenderer.getContextHandle();
                console.log("CTX", ctx);
                let renderer = gl;
                api.SetParam(ctx, 'Exposure', 1.1);

                setupScene({ gltfModel, api, glApiRenderer, gl, scene, camera, renderer });
                view = glApiRenderer.createView();
                setViewFromLightTracer(view);
                console.log("My View", view);


                const canvas = gl.domElement;
                const dpr = 1.0; //window.devicePixelRatio; TODO
                const width = (canvas.width = window.innerWidth * dpr);
                const height = (canvas.height = window.innerHeight * dpr);
                //camera.aspect = width / height;
                camera.updateProjectionMatrix();
                gl.setSize(width, height);
                view.setViewport([0, 0, width, height]);

            })
            .catch((e: any) => {
                console.log('ERROR', e);
            });
    }, [])


    useEffect(() => {

        // Access the camera's matrix
        setcameraPreviousMatrix(camera.matrixWorld)
        // Use the camera matrix as needed
        console.log('Camera Matrix:', cameraPreviousMatrix);
    }, [camera]);
    let spp = 0;
    useFrame(() => {
        function arrayEquals(a: any, b: any) {
            return (
                Array.isArray(a)
                && Array.isArray(b)
                && a.length === b.length
                && a.every((val, index) => Math.abs(val - b[index]) < 1e-5)
            );
        }
        camera.updateMatrix();
        if (useLT) {

            gl.getContext().pixelStorei(gl.getContext().UNPACK_FLIP_Y_WEBGL, 0);
            gl.getContext().pixelStorei(gl.getContext().UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            if (!arrayEquals(cameraPreviousMatrix, camera.matrix.elements)) {
                spp = 0;
                setcameraPreviousMatrix([...camera.matrix.elements]);
            }
            let targetSpp = 512;
            // if (glApiRendererFromLightTracer?.getTargetSpp) targetSpp = glApiRendererFromLightTracer?.getTargetSpp();
            if (spp < targetSpp) {

                const viewMatrix = new THREE.Matrix4()
                    // .set(...cameraPreviousMatrix)
                    .transpose()
                    .invert();
                const projMatrix = camera.projectionMatrix;

                viewFromLightTracer.setCameraMatrices(viewMatrix.elements, projMatrix.elements);
                spp += 1;

                glApiRendererFromLightTracer.draw(viewFromLightTracer);
            }
        }
        else {
            // this.useLT


            gl.resetState();
            gl.render(scene, camera);
        }
        console.log(spp);

    });

    return null;
};

export default LightTracer;

