import Productos from "../Components/Productos"
import firebase from "../config/firebase";
import Button from "react-bootstrap/Button"
import { useFetchProducts } from "../Utils/useFetchProducts";

const style={
    button:{
        width:"100px",
        height:"50px",
        backgroundColor:"#202d56"
    },
    buscar:{
        backgroundColor:"gray",
        padding:"5px",
        marginTop:"70px"

    },
    input:{
        borderRadius:"10px"
    },
    principal:{
        marginTop:"100px",
        border:"2px solid gray",
        height:"500px",
        margin:"10px",
        borderRadius:"5px",
        width:"60%"
    },
    productos:{

    }
}

function Venta() {

    return (
        <>
            <div style={style.principal}>

                <div style={style.productos}>
                    <ul>
                        <li>

                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Venta;
