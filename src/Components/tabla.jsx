import React, { useState, useEffect } from "react";
import { getAll } from "../Services/productosServices";
import Producto from "./Producto";
import Loading from "./Loading/Loading";
import "../styles/tabla.css";
import Pagination from "./Pagination";

function Tabla() {
  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("titulo");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

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

  // Obtener el índice del último producto en la página actual
const indexOfLastProduct = currentPage * productsPerPage;
// Obtener el índice del primer producto en la página actual
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
// Productos de la página actual
const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"white"} fill={"none"}>
              <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"white"} fill={"none"}>
              <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"white"} fill={"none"}>
              <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
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
        {currentProducts.map((product) => (
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
    <Pagination
  productsPerPage={productsPerPage}
  totalProducts={productos.length}
  currentPage={currentPage}
  paginate={paginate}
/>

  </>
);
}
export default Tabla;