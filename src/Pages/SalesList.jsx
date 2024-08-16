import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import Pagination from "../Components/Pagination";
import "../styles/salesList.css";

const db = getFirestore();

const SalesList = () => {
  const [salesByDate, setSalesByDate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetailsPage, setCurrentDetailsPage] = useState({});
  const [detailsVisible, setDetailsVisible] = useState({});

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
            const date = new Date(sale.timestamp).toLocaleDateString();
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

        salesArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        setSalesByDate(salesArray);
      } catch (error) {
        console.error("Error al obtener las ventas: ", error);
      }
    };

    fetchSales();
  }, []);

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
        const updatedSales = salesByDate.map((day) => {
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
        setSalesByDate(updatedSales);
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
  const currentSales = salesByDate.slice(indexOfFirstSale, indexOfLastSale);

  return (
    <div className="sales-list">
      <div className="separado">
        <h1>VENTAS POR DÍA</h1>
      </div>

      {/* Tabla de ventas diarias */}
      {currentSales.length === 0 ? (
        <p>No hay ventas disponibles</p>
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
      {salesByDate.length > salesPerPage && (
        <Pagination
          productsPerPage={salesPerPage}
          totalProducts={salesByDate.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      )}
    </div>
  );
};

export default SalesList;
