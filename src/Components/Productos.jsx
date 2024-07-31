
import Button from "react-bootstrap/Button"
import Loading from "./Loading/Loading"
import { useFetchProducts } from "../Utils/useFetchProducts";
import Tabla from "./tabla";
import { useState } from "react";

const style={
    button:{
        width:"100px",
        height:"50px",
        backgroundColor:"#202d56"
    },
    buscar:{
        margin:"10px",
        marginTop:"70px"
    }
}

function Productos(){  
    const {loading,productos,setProductos}=useFetchProducts()
    const [buscar, setBuscar] = useState("");

    const handleChange = e =>{
        setBuscar(e.target.value)
        filtrar(e.target.value);
    }

    const filtrar = (inputBusqueda) =>{
        var resultado = productos.filter((element) =>{
            if(element.name.toString().toLowerCase().includes(inputBusqueda.toLowerCase()))
            {
                return element
            }
        });
    setProductos(resultado)
    }

        return (
                <>
                    <Loading loading={loading}>
                    <div style={style.buscar}>
                    <input type="text" value={buscar} onChange={handleChange} />
                    <Button variant="primary" type="submit" style={style.button}>Buscar</Button>
                    </div>
                    
                    <div>
                        <Tabla/>
                    </div>
                    </Loading>
                </>
            );
        }



export default Productos;
