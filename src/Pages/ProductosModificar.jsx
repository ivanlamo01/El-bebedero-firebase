import  Button from "react-bootstrap/Button"
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
      backgroundColor:"#027fbb",
      display:"flex",
      justifyContent:"center"
  },
  h1:{
    color:"white",
    marginTop:"200px",
    fontSize:"60px",
    fontWeight:"900"
},}


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
        setValue("thumbnail",response.data().thumbnail)
        setValue("description",response.data().description) 
        setLoading(false)
      } catch (e) {
        console.log(e);
      }
    }
    request()
  }, [detalleId, setValue])

  const onSubmit = async (data) =>{
    console.log(data);
    try {
      const document =  update(detalleId,data)
      if (document) {
        navigate('/')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelete =()=>{
    try {
      const document = remove(detalleId)
      if (document) {
        navigate('/')
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
      <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
            <Input label="imagen"   register={{...register("thumbnail", { required: true })}} />
                  {errors.email && (
                    <div>
                        <span>This field is required</span>
                    </div>)}
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
            <Input label="Descripcion"   register={{...register("description", { required: true })}} />
              {errors.email && (
                <div>
                    <span>This field is required</span>
                </div>)}

              <Button variant="primary" type="submit" >Guardar</Button>
              <Button variant="danger" type="submit" onClick={handleDelete} >Eliminar</Button>
        </Form>
        </Container>
    </div>
    </Loading>
    </>
    )
}

export default ProductosAlta;
