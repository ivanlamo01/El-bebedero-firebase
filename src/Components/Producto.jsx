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
        width:"90%",
        margin:"10%"
    },
    itemtabla:{
        width:"15%"
    }
    }

function Producto({id,title,price,thumbnail,description}) {
    const {login} = useAuthContext()
    return (
        
        <> 
                    <div>
                    <table style={style.tabla}>
                        <tbody>
                            <tr>
                                <th style={style.itemtabla} scope="row">{id}</th>
                                <td style={style.itemtabla}>{title}</td>
                                <td style={style.itemtabla}>{price}</td>
                                <td style={style.itemtabla}>{description}</td>
                                <td style={style.itemtabla}>
                                    <Button  className="boton" as={Link} to={`/detalle/${id}`} style={style.buttons}>Comprar</Button>
                                </td>
                                <td style={style.itemtabla}>
                                    {login&&(
                                    <>
                                        <Button  className="boton" as={Link} to={`/detalle/editar/${id}`} style={style.buttons}>Editar</Button>
                                    </>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    
            
        </>
        );
    }

export default Producto ;