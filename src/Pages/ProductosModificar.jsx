
import  Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import Input from "../Components/Input";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getById, update,remove} from "../Services/productosServices";
import { useEffect,useState } from "react";
import Loading from "../Components/Loading/Loading";


const style={
  separador:{
      height:"500px",
      backgroundColor:"#FFAE00",
      display:"flex",
      justifyContent:"center",
      borderRadius:"20px"
  },
  h1:{
    color:"white",
    marginTop:"200px",
    fontSize:"60px",
    fontWeight:"900"
},
container:{
  maxWidth: "370px",
  marginTop: "50px",
  marginBottom: "50px",
  borderRadius: "30px",
  backgroundColor: "rgba(33, 33, 33, 255)",
  boxShadow: "0 4px 8px black",
  padding: "20px",
  color: "white"
},
}


function ProductosAlta() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, setValue} = useForm({mode:"onChange"});
  const navigate= useNavigate();
  const {detalleId} = useParams();
  
  useEffect(() =>{
    const request = async()=>{
      try {
        const response = await getById(detalleId)
        setValue("title",response.data().title)
        setValue("price",response.data().price)
        setValue("category",response.data().category)
        setValue("stock",response.data().stock) 
        setValue("Barcode",response.data().Barcode) 
        setLoading(false)
      } catch (e) {
        console.log(e);
      }
    }
    request()
  }, [detalleId, setValue])

  const onSubmit = async (data) =>{
    try {
      const document =  update(detalleId,data)
      if (document) {
        navigate('/inventario')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelete =()=>{
    try {
      const document = remove(detalleId)
      if (document) {
        navigate('/inventario')
      }
    } catch (e) {
      console.log(e);
    }
  }
  return(
    <>
    <div style={style.separador}>
    <h1 style={style.h1}>EDICIÓN</h1>
    </div>
    <Loading loading={loading} >
      <div>
      <Container style={style.container}>
      <Form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Precio" register={{...register("price", { required: true })}}/>
                {errors.nombre && (
                <div>
                    <span>This field is required</span>
                </div>)}
            <Input label="Titulo" register={{...register("title", { required: true })}}  />
              {errors.apellido && (
                <div>
                    <span>This field is required</span>
                </div>)}
            <Input label="Categoria"   register={{...register("category", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}
                <Input label="Codigo de baras"   register={{...register("Barcode", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}
                <Input label="Stock"   register={{...register("stock", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}
              <button className="save-button" type="submit" >Guardar</button>
              <button className="cancel-button" type="submit" onClick={handleDelete} >Eliminar</button>
        </Form>
        </Container>
    </div>
    </Loading>
    </>
    )
}

export default ProductosAlta;
