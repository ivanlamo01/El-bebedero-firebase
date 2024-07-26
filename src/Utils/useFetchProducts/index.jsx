import { useEffect, useState } from "react";


export const useFetchProducts = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);



  return {
    productos,
    loading,
  };
};



