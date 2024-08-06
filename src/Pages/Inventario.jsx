
import Tabla from "../Components/tabla";

const style={
    separador:{
        height:"500px",
        backgroundColor:"#FFAE00",
        display:"flex",
        justifyContent:"center",
        borderRadius:"20px"
    },
    h1:{
        color:"white",
        marginTop:"200px",
        fontSize:"60px",
        fontWeight:"900"
    },
    cont:{
        borderRadius:"20px",
        backgroundColor:" rgba(33, 33, 33, 255)",
        color:"white"
    }
}

function Inventario() {
    return (
        <>
        <div style={style.cont} >
            <div style={style.separador}>
                <h1 style={style.h1}>INVENTARIO</h1>
            </div>
            <Tabla/>
            </div>
        </>
    );
}

export default Inventario;
