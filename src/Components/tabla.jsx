import React, { useState, useEffect } from 'react';
import { getAll } from "../Services/productosServices";
import Producto from "./Producto";
import Loading from "./Loading/Loading";

const style = {
  button: {
    width: "100px",
    height: "50px",
    backgroundColor: "#202d56"
  },
  buscar: {
    margin: "10px"
  },
  tabla: {
    tableLayout: "fixed",
    width: "95%",
    marginLeft: "2.5%",
    borderCollapse: "collapse",
    border: "black 1px solid",
    textAlign: "center"
  },
  itemtabla1: {
    width: "20%",
    padding: "10px"
  },
  itemtabla2: {
    width: "20%"
  },
  itemtabla3: {
    width: "15%"
  },
  itemtabla4: {
    width: "15%"
  },
  itemtabla5: {
    width: "12.5%"
  },
  itemtabla6: {
    width: "12.5%"
  },
  tbody: {
    borderCollapse: "collapse",
    border: "black 1px solid",
    textAlign: "center"
  },
  clearButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 5px",
},
};


function Tabla() {
  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("titulo"); // Estado para manejar el filtro seleccionado

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
          <div style={style.buscar}>
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
                                  style={style.clearButton}
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
                                  style={style.clearButton}
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
                                  style={style.clearButton}
                                  onClick={clearInput(setBarcode)}
                              >
                                  X
                              </button>
                          )}
                      </div>
                  )}
              </form>
          </div>
          <table style={style.tabla}>
              <thead style={style.tr}>
                  <tr>
                      <th style={style.itemtabla1} scope="col">Barcode</th>
                      <th style={style.itemtabla2} scope="col">Titulo</th>
                      <th style={style.itemtabla3} scope="col">Precio</th>
                      <th style={style.itemtabla4} scope="col">Categoria</th>
                      <th style={style.itemtabla5} scope="col">Stock</th>
                      <th style={style.itemtabla6} scope="col">Editar</th>
                  </tr>
              </thead>
              <tbody style={style.tbody}>
                  {productos.map((product) => (
                      <Producto
                          key={product.id}
                          id={product.id}
                          title={product.data.title}
                          stock={product.data.stock}
                          price={product.data.price}
                          category={product.data.category}
                          Barcode={product.data.Barcode}
                          // Condición para deshabilitar el producto si el stock es 0
                          disabled={product.data.stock === 0}
                      />
                  ))}
              </tbody>
          </table>
      </>
  );
}

export default Tabla;