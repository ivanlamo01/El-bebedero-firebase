import { Link } from "react-router-dom";
import {Button} from "react-bootstrap";
import { useAuthContext } from "../Context/AuthContext";

const style={
    precioBoton:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        
    },
    buttons:{
        height:"40px",
        marginTop:"20px",
        backgroundColor:"#202d56",
        margin:"10px"
    },
    botones:{
        display:"flex",
    },
    tabla:{
        textAlign:"center",
        width:"95%",
        marginLeft:"2.5%",
    },
    itemtabla1:{
        width:"20%",
        padding:"10px",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    itemtabla2:{
        width:"20%",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    itemtabla3:{
        width:"15%",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    itemtabla4:{
        width:"15%",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    itemtabla5:{
        width:"12.5%",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    itemtabla6:{
        width:"12.5%",
        borderCollapse: "collapse",
        border: "black 1px solid"
    },
    deshabilitado: {
        color: "gray",
        textDecoration: "line-through",
    },
}


function Producto({id,title,price,Barcode,category,stock}) {
    const {login} = useAuthContext()
    return (
        
        <> 
                            <tr style={stock <= 0 ? style.deshabilitado : {}}>
                                
                                <td style={style.itemtabla1}>{Barcode}</td>
                                <td style={style.itemtabla2}>{title}</td>
                                <td style={style.itemtabla3}>{price}</td>
                                <td style={style.itemtabla4}>{category}</td>
                                <td style={style.itemtabla5}>{stock}</td>
                                <td style={style.itemtabla6}>
                                    {login&&(
                                    <>
                                        <Button  className="boton" as={Link} to={`/detalle/editar/${id}`} style={style.buttons}>Editar</Button>
                                    </>
                                    )}
                                </td>
                            </tr>
                    
            
        </>
        );
    }

export default Producto ;