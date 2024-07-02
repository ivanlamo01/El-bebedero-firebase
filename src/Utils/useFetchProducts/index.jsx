import { useEffect, useState } from "react";
import { getAll} from "../../Services/productosServices";

export const useFetchProducts = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const request = async () => {
      try {
        const response = await getAll();
        setProductos(response);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    request();
  }, []);


  return {
    productos,
    loading,
  };
};



