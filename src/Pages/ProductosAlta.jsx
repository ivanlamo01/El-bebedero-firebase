import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Input from "../Components/Input";
import Container from "react-bootstrap/Container";
import { create } from "../Services/productosServices";
import { useState } from "react";
import Check from '../Components/Check';
import { Spinner } from "react-bootstrap";
import "../styles/prodAlta.css";
import { Timestamp } from "firebase/firestore";

const style = {
  separador: {
    height: "500px",
    backgroundColor: "#FFAE00",
    display: "flex",
    justifyContent: "center"
  },
  h1: {
    color: "white",
    marginTop: "200px",
    fontSize: "60px",
    fontWeight: "900"
  },
  container: {
    maxWidth: "370px",
    marginTop: "50px",
    marginBottom: "50px",
    borderRadius: "30px",
    backgroundColor: "rgba(33, 33, 33, 255)",
    boxShadow: "0 4px 8px black",
    padding: "20px",
    color: "white"
  }
};

function ProductosAlta() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });
  const [alert, setAlert] = useState({ variant: "", text: "" });
  const [loading, setLoading] = useState(false);
  const timest = new Date();

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const document = await create({ ...data, dateAdded: Timestamp.fromDate(timest) });
      if (document) {
        setAlert({ variant: "success", text: "¡Exitoso!", duration: 1500 });
        setLoading(false);
        window.location.reload(false);
      }
    } catch (e) {
      console.log(e);
      setAlert({ variant: "danger", text: "Error" });
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={style.separador}>
        <h1 style={style.h1}>AGREGAR PRODUCTO</h1>
      </div>
      <Container style={style.container}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Precio" register={{ ...register("price", { required: true }) }} />
          {errors.price && <div><span>This field is required</span></div>}
          <Input label="Titulo" register={{ ...register("title", { required: true }) }} className="input" />
          {errors.title && <div><span>This field is required</span></div>}
          <Input label="Categoria" register={{ ...register("category", { required: true }) }} />
          {errors.category && <div><span>This field is required</span></div>}
          <Input label="Codigo de barras" type="number" register={{ ...register("Barcode", { required: true }) }} />
          {errors.Barcode && <div><span>This field is required</span></div>}
          <Input label="Stock" register={{ ...register("stock", { required: true }) }} />
          {errors.stock && <div><span>This field is required</span></div>}

          <button type="submit" className="boton">
            {loading ? <Spinner animation="border" size="sm" /> : "Guardar"}
          </button>
          {alert && <Check {...alert} />}
        </Form>
      </Container>
    </div>
  );
}

export default ProductosAlta;
