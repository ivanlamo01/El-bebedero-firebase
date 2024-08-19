import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import Pagination from "../Components/Pagination";
import "../styles/salesList.css";

const db = getFirestore();

const SalesList = () => {
  const [salesByDate, setSalesByDate] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetailsPage, setCurrentDetailsPage] = useState({});
  const [detailsVisible, setDetailsVisible] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const salesPerPage = 5; // Número de días por página
  const detailsPerPage = 5; // Número de detalles por página

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp ? data.timestamp.toDate() : null,
            total: Number(data.total) || 0,
          };
        });

        const groupedSales = salesList.reduce((acc, sale) => {
          if (sale.timestamp) {
            const date = sale.timestamp.toLocaleDateString(); // Mantener como cadena para la clave del objeto
            if (!acc[date]) {
              acc[date] = { total: 0, count: 0, sales: [] };
            }
            acc[date].total += Number(sale.total) || 0;
            acc[date].count += 1;
            acc[date].sales.push(sale);
          }
          return acc;
        }, {});

        const salesArray = Object.entries(groupedSales).map(([date, data]) => ({
          date,
          total: data.total.toFixed(2),
          count: data.count,
          sales: data.sales,
        }));

        // Ordenar por fecha en orden descendente (convertir a objetos Date para la comparación)
        salesArray.sort((a, b) => new Date(b.date.split("/").reverse().join("-")) - new Date(a.date.split("/").reverse().join("-")));

        setSalesByDate(salesArray);
        setFilteredSales(salesArray);
      } catch (error) {
        console.error("Error al obtener las ventas: ", error);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const filterSalesByDate = () => {
      if (startDate && endDate) {
        const filtered = salesByDate.filter((sale) => {
          const saleDate = new Date(sale.date.split("/").reverse().join("-"));
          return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
        });
        setFilteredSales(filtered);
      } else {
        setFilteredSales(salesByDate);
      }
    };

    filterSalesByDate();
  }, [startDate, endDate, salesByDate]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginateDetails = (pageNumber, date) => {
    setCurrentDetailsPage((prev) => ({
      ...prev,
      [date]: pageNumber,
    }));
  };

  const handleDelete = async (id, date) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta venta?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "sales", id));
        const updatedSales = filteredSales.map((day) => {
          if (day.date === date) {
            const filteredSales = day.sales.filter((sale) => sale.id !== id);
            return {
              ...day,
              sales: filteredSales,
              count: day.count - 1,
              total: filteredSales.reduce((total, sale) => total + Number(sale.total), 0).toFixed(2),
            };
          }
          return day;
        }).filter((day) => day.sales.length > 0);
        setFilteredSales(updatedSales);
      } catch (error) {
        console.error("Error al eliminar la venta: ", error);
      }
    }
  };

  const toggleDetails = (date) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Obtener las ventas actuales basadas en la paginación
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  return (
    <div className="sales-list">
      <div className="separado">
        <h1>VENTAS POR DÍA</h1>
      </div>

      {/* Filtros de fecha */}
      <div className="date-filter">
        <label htmlFor="startDate">Fecha Inicial:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">Fecha Final:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Tabla de ventas diarias */}
      {currentSales.length === 0 ? (
        <p>No hay ventas disponibles para el período seleccionado</p>
      ) : (
        currentSales.map(({ date, total, count, sales }) => {
          const currentPageDetails = currentDetailsPage[date] || 1;
          const indexOfLastDetail = currentPageDetails * detailsPerPage;
          const indexOfFirstDetail = indexOfLastDetail - detailsPerPage;
          const currentDetails = sales.slice(indexOfFirstDetail, indexOfLastDetail);

          return (
            <div key={date} className="sales-day">
              <h2>{date}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Total Vendido</th>
                    <th>Cantidad de Ventas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${total}</td>
                    <td>{count}</td>
                    <td>
                      <button onClick={() => toggleDetails(date)} className="save-button">
                        {detailsVisible[date] ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Detalles con paginación */}
              {detailsVisible[date] && (
                <>
                  <table id={`details-${date}`} className="details-table" style={{ marginTop: "10px", width: "100%" }}>
                    <thead>
                      <tr>
                        <th>ID de Venta</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                        <th>Fecha y Hora</th>
                        <th>Productos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDetails.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>${Number(sale.total).toFixed(2)}</td>
                          <td>{sale.paymentMethod || "Método de pago no disponible"}</td>
                          <td>{sale.timestamp ? sale.timestamp.toLocaleString() : "Fecha no disponible"}</td>
                          <td>
                            <ul>
                              {sale.products && sale.products.length > 0 ? (
                                sale.products.map((product, index) => (
                                  <li key={index}>
                                    {product.title} - ${Number(product.price).toFixed(2)} x {product.quantity}
                                    {product.description && (
                                      <p>Descripción: {product.description}</p>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li>No hay productos disponibles</li>
                              )}
                            </ul>
                          </td>
                          <td>
                            <button onClick={() => handleDelete(sale.id, date)} className="cancel-button">
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación de los detalles */}
                  {sales.length > detailsPerPage && (
                    <Pagination
                      productsPerPage={detailsPerPage}
                      totalProducts={sales.length}
                      currentPage={currentPageDetails}
                      paginate={(pageNumber) => paginateDetails(pageNumber, date)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })
      )}

      {/* Componente de paginación para las ventas diarias */}
      {filteredSales.length > salesPerPage && (
        <Pagination
          productsPerPage={salesPerPage}
          totalProducts={filteredSales.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      )}
    </div>
  );
};

export default SalesList;
