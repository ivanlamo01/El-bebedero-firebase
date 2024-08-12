import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import "../styles/salesList.css";

const db = getFirestore();

const SalesList = () => {
  const [salesByDate, setSalesByDate] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedSales = salesList.reduce((acc, sale) => {
          const date = sale.timestamp
            ? new Date(sale.timestamp.seconds * 1000).toISOString().split("T")[0]
            : "Fecha no disponible";
          if (!acc[date]) {
            acc[date] = { total: 0, count: 0, sales: [] };
          }
          acc[date].total += Number(sale.total) || 0;
          acc[date].count += 1;
          acc[date].sales.push(sale);
          return acc;
        }, {});

        // Convertir el objeto a un array y ordenar por fecha
        const salesArray = Object.entries(groupedSales).map(([date, data]) => ({
          date,
          total: data.total.toFixed(2),
          count: data.count,
          sales: data.sales,
        }));

        // Ordenar por fecha, de más reciente a más antigua
        salesArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        setSalesByDate(salesArray);
      } catch (error) {
        console.error("Error al obtener las ventas: ", error);
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (id, date) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta venta?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "sales", id));
        const updatedSales = salesByDate.map((day) => {
          if (day.date === date) {
            const filteredSales = day.sales.filter((sale) => sale.id !== id);
            return { ...day, sales: filteredSales, count: day.count - 1, total: day.total - Number(filteredSales.find(sale => sale.id === id)?.total || 0) };
          }
          return day;
        }).filter(day => day.sales.length > 0);
        setSalesByDate(updatedSales);
      } catch (error) {
        console.error("Error al eliminar la venta: ", error);
      }
    }
  };

  const toggleDetails = (date) => {
    const detailsElement = document.getElementById(`details-${date}`);
    detailsElement.style.display = detailsElement.style.display === "none" ? "table-row-group" : "none";
  };

  return (
    <div className="sales-list">
      <div className="separado">
        <h1>VENTAS POR DÍA</h1>
      </div>
      {salesByDate.length === 0 ? (
        <p>No hay ventas disponibles</p>
      ) : (
        salesByDate.map(({ date, total, count, sales }) => (
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
                    <button
                      onClick={() => toggleDetails(date)}
                      className="details-btn"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              id={`details-${date}`}
              style={{ display: "none", marginTop: "10px", width: "100%" }}
              className="details-table"
            >
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
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>${Number(sale.total).toFixed(2)}</td>
                    <td>{sale.paymentMethod || "Método de pago no disponible"}</td>
                    <td>
                      {sale.timestamp
                        ? new Date(sale.timestamp.seconds * 1000).toLocaleString()
                        : "Fecha no disponible"}
                    </td>
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
                      <button
                        onClick={() => handleDelete(sale.id, date)}
                        className="delete-button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default SalesList;
