
import Tabla from "../Components/tabla";

const style={
    separador:{
        height:"500px",
        backgroundColor:"#FFAE00",
        display:"flex",
        justifyContent:"center"
    },
    h1:{
        color:"white",
        marginTop:"200px",
        fontSize:"60px",
        fontWeight:"900"
    }
}

function Home() {
    return (
        <>
            <div style={style.separador}>
                <h1 style={style.h1}>INVENTARIO</h1>
            </div>
            <Tabla/>
        </>
    );
}

export default Inventario;
