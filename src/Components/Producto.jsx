import { Link } from "react-router-dom";
import {Button} from "react-bootstrap";
import { useAuthContext } from "../Context/AuthContext";

const style={

    itemtabla1:{
        width:"20%",
        padding:"10px",
    },
    itemtabla2:{
        width:"20%",
    },
    itemtabla3:{
        width:"15%",
    },
    itemtabla5:{
        width:"12.5%",
    },
    deshabilitado: {
        color: "gray",
        textDecoration: "line-through",
    },
    tr:{
        border: "#ddd 1px solid",
        borderCollapse: "collapse",
    }
}


function Producto({id,title,price,Barcode,category,stock}) {
    const {login} = useAuthContext()
    return (
        
        <> 
                            <tr style={stock <= 0 ? style.deshabilitado : style.tr}>
                                <td style={style.itemtabla1}>{Barcode}</td>
                                <td style={style.itemtabla2}>{title}</td>
                                <td style={style.itemtabla3}>{price}</td>
                                <td style={style.itemtabla3}>{category}</td>
                                <td style={style.itemtabla5}>{stock}</td>
                                <td style={style.itemtabla5}>
                                    {login&&(
                                    <>
                                        <Button as={Link} to={`/detalle/editar/${id}`} className="edit-button" >Editar</Button>
                                    </>
                                    )}
                                </td>
                            </tr>
                    
            
        </>
        );
    }

export default Producto ;