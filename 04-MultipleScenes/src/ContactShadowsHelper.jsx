import { ContactShadows } from "@react-three/drei"
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