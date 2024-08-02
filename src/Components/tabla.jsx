import React, { useState, useEffect } from "react";
import { getAll } from "../Services/productosServices";
import Producto from "./Producto";
import Loading from "./Loading/Loading";
import "../styles/tabla.css";

function Tabla() {
  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("titulo");

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await getAll(buscar, categoria, barcode);
        setProductos(response);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchProductos();
  }, [buscar, categoria, barcode]);

  const handleSearch = (event) => {
    event.preventDefault();
    setBuscar(event.target.elements.query.value);
    setCategoria(event.target.elements.category.value);
    setBarcode(event.target.elements.barcode.value);
  };

  const clearInput = (setter) => () => setter("");

  return (
    <>
      <Loading loading={loading} />
      <div className="buscar">
        <form onSubmit={handleSearch}>
          <select onChange={(e) => setFiltro(e.target.value)} value={filtro}>
            <option value="titulo">Filtrar por título</option>
            <option value="categoria">Filtrar por categoría</option>
            <option value="barcode">Filtrar por barcode</option>
          </select>
          {filtro === "titulo" && (
            <div>
              <input
                type="text"
                name="query"
                placeholder="Buscar título"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
              />
              {buscar && (
                <button
                  type="button"
                  className="clearButton"
                  onClick={clearInput(setBuscar)}
                >
                  X
                </button>
              )}
            </div>
          )}
          {filtro === "categoria" && (
            <div>
              <input
                type="text"
                name="category"
                placeholder="Buscar categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
              {categoria && (
                <button
                  type="button"
                  className="clearButton"
                  onClick={clearInput(setCategoria)}
                >
                  X
                </button>
              )}
            </div>
          )}
          {filtro === "barcode" && (
            <div>
              <input
                type="number"
                min={0}
                name="barcode"
                placeholder="Buscar barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              {barcode && (
                <button
                  type="button"
                  className="clearButton"
                  onClick={clearInput(setBarcode)}
                >
                  X
                </button>
              )}
            </div>
          )}
        </form>
      </div>
      <table className="tabla">
        <thead className="tr">
          <tr>
            <th className="itemtabla1" scope="col">
              Barcode
            </th>
            <th className="itemtabla2" scope="col">
              Título
            </th>
            <th className="itemtabla3" scope="col">
              Precio
            </th>
            <th className="itemtabla3" scope="col">
              Categoría
            </th>
            <th className="itemtabla5" scope="col">
              Stock
            </th>
            <th className="itemtabla5" scope="col">
              Editar
            </th>
          </tr>
        </thead>
        <tbody className="tbody">
          {productos.map((product) => (
            <Producto
              key={product.id}
              id={product.id}
              title={product.data.title}
              stock={product.data.stock}
              price={product.data.price}
              category={product.data.category}
              Barcode={product.data.Barcode}
              variablePrice={product.data.variablePrice}
              disabled={product.data.stock === 0}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Tabla;
