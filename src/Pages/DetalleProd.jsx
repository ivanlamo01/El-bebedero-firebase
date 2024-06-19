import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById} from "../Services/productosServices";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading/Loading"
import Button from "react-bootstrap/Button";

const style ={
    detalle:{
        backgroundColor:"#FF8C91",
        display:"flex",
        textDecoration:"none",
        justifyContent:"center"

    },
    button:{
        width:"200px",
        height:"70px",
        backgroundColor:"#202d56",
        borderRadius:"20px"
    },
    det:{
        marginTop:"200px",
        display:"flex",
        justifyContent:"center"
    },
    text:{
        color:"#202d56",
        fontWeight:"700"
    },
    talles:{
        display:"flex",
    },
    price:{
        color:"#202d56",
        fontWeight:"550",
        fontSize:"32px"
    }
}

function DetalleProd() {
    const {detalleId} = useParams();
    const [producto,setProducto] = useState({})
    const [loading,setLoading] = useState(true)

    useEffect(()=>{ 
        const request = async()=>{
            try{
                const response = await getById(detalleId)
                    setProducto(response.data())
                    console.log(response);
                    setLoading(false)
            }catch(e){
                console.log(e);
            }
        }
        request()
    },
    [detalleId])   


    return <>
        <div style={style.detalle}>
            <Loading loading={loading}>
                <div style={style.det}>
                    <div style={style.img}>
                        <img src={producto.thumbnail} alt="" />
                    </div>    
                    <div >
                        <h1 style={style.text}>{producto.title}</h1>
                        <p style={style.text}>{producto.description}</p>
                        <div>
                            <h3 style={style.text}>Seleccione su talle</h3>
                            <div style={style.talles}>
                                <button type="radio" className="button">S</button>
                                <button type="radio" className="button">M</button>
                                <button type="radio" className="button">L</button>
                            </div>
                            
                        </div>

                        <p style={style.price}>$ {producto.price}</p>
                        <p>{producto.warranty}</p>
                            <Button  type="submit" style={style.button} className="botonCompra">
                                <Link to={`/compra/`} style={{color:"white",textDecoration:"none"}}> Comprar Ahora</Link>    
                            </Button>
                    </div>
                </div>
            </Loading>
        </div>
        </>
}
export default DetalleProd;