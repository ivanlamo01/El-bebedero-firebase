import Producto from  "./Producto"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row";
import Loading from "./Loading/Loading"
import { useFetchProducts } from "../Utils/useFetchProducts";

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
    const {productos,loading,buscar,setBuscar}=useFetchProducts()
        return (
                <>
                    <Loading loading={loading}>
                    <div style={style.buscar}>
                    <input type="text"  onChange={(event)=>setBuscar(event.target.value)} />
                    <Button variant="primary" type="submit" value={buscar} style={style.button}>Buscar</Button>
                    </div>

                    <Row>
                        {productos.map((product) => (
                            <Producto{...product.data()}
                                key={product.id}
                                id={ product.id }
                            />)
                        )}
                    </Row>
                    </Loading>
                </>
            );
        }



export default Productos;
