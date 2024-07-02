import Producto from  "./Producto"
import { useFetchProducts } from "../Utils/useFetchProducts";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const style={
    button:{
        width:"100px",
        height:"50px",
        backgroundColor:"#202d56"
    },
    buscar:{
        margin:"10px"
    },
    tabla:{
        width:"90%",
        marginLeft:"10%",

    },
    tr:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    buscar:{
        margin:"10px",
        marginTop:"70px"
    }
}

function Tabla(){ 
    const {productos}=useFetchProducts()
    const [buscar, setBuscar] = useState("");

    return(
                    <div>
                        <table style={style.tabla}>
                            <thead>
                                <tr style={style.tr}>
                                    <th style={style.itemtabla} scope="col">ID</th>
                                    <th style={style.itemtabla} scope="col">Titulo</th>
                                    <th style={style.itemtabla} scope="col">Precio</th>
                                    <th style={style.itemtabla} scope="col">Categoria</th>
                                    <th style={style.itemtabla} scope="col">Comprar</th>
                                    <th style={style.itemtabla} scope="col">Editar</th>
                                </tr>
                            </thead>
                        </table>
                    <div>
                    {productos.map((product) => (
                                    <Producto{...product.data()}
                                        key={product.id}
                                    />)
                                    )}
                    </div>
                        


                    </div>
        )
    }

export default Tabla;
