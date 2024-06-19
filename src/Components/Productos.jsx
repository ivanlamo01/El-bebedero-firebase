
import Button from "react-bootstrap/Button"
import Loading from "./Loading/Loading"
import { useFetchProducts } from "../Utils/useFetchProducts";
import Tabla from "./tabla";

const style={
    button:{
        width:"100px",
        height:"50px",
        backgroundColor:"#202d56"
    },
    buscar:{
        margin:"10px"
    }
}

function Productos(){  
    const {loading,buscar,setBuscar}=useFetchProducts()
        return (
                <>
                    <Loading loading={loading}>
                    <div style={style.buscar}>
                    <input type="text"  onChange={(event)=>setBuscar(event.target.value)} />
                    <Button variant="primary" type="submit" value={buscar} style={style.button}>Buscar</Button>
                    </div>
                    
                    <div>
                        <Tabla/>
                    </div>
                    </Loading>
                </>
            );
        }



export default Productos;
