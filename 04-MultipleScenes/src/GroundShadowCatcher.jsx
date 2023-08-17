import { useControls } from "leva";
export default function GroundShadowCatcher() {
  const { enable ,rotation, position, size, color, opacity } = useControls(
    "Ground Shadow Catcher",
    {
      enable: true,
      rotation: {
        value: { x: -Math.PI / 2, y: 0, z: 0 },
        step: 0.01,
      },
      position: {
        value: { x: 0, y: 0, z: 0 },
        step: 0.01,
      },
      size: {
        value: { x: 100, y: 100 },
        step: 0.1,
      },
      color: "#000000",
      opacity: { value: 0.2, min: 0, max: 1, step: 0.01 },
    }
  );
  return (
    <>
      {enable ? (
        <mesh
          receiveShadow
          rotation={[rotation.x, rotation.y, rotation.z]}
          position={[position.x, position.y, position.z]}
        >
          <planeGeometry args={[size.x, size.y, 1, 1]} />
          <shadowMaterial attach="material" color={color} opacity={opacity} />
        </mesh>
      ) : null}
    </>
  );
}