import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import "../styles/salesList.css";

const db = getFirestore();

const SalesList = () => {
  const [salesByDate, setSalesByDate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSales, setFilteredSales] = useState(null);

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
              total: filteredSales.reduce((total, sale) => total + Number(sale.total), 0).toFixed(2) 
            };
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
    if (detailsElement) {
      detailsElement.style.display = detailsElement.style.display === "none" ? "table-row-group" : "none";
    }
  };

  const handleFilterSales = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = salesByDate.flatMap((day) =>
      day.sales.filter((sale) => sale.timestamp >= start && sale.timestamp <= end)
    );

    const total = filtered.reduce((sum, sale) => sum + Number(sale.total), 0).toFixed(2);

    setFilteredSales({
      startDate: start.toLocaleString(),
      endDate: end.toLocaleString(),
      total,
      count: filtered.length,
      sales: filtered,
    });
  };

  return (
    <div className="sales-list">
      <div className="separado">
        <h1>VENTAS POR DÍA</h1>
      </div>

      {/* Rango de fecha y hora */}
      <div className="date-time-range">
        <label>
          Fecha y Hora de Inicio:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fecha y Hora de Fin:
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFilterSales} className="save-button">Filtrar Ventas</button>
      </div>

      {filteredSales && (
        <div className="sales-period">
          <h2>Ventas desde {filteredSales.startDate} hasta {filteredSales.endDate}</h2>
          <table>
            <thead>
              <tr>
                <th>Total Vendido</th>
                <th>Cantidad de Ventas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${filteredSales.total}</td>
                <td>{filteredSales.count}</td>
              </tr>
            </tbody>
          </table>
          <table className="details-table" style={{ marginTop: "10px", width: "100%" }}>
            <thead>
              <tr>
                <th>ID de Venta</th>
                <th>Total</th>
                <th>Método de Pago</th>
                <th>Fecha y Hora</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.sales.map((sale) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla original por día */}
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
                    <button onClick={() => toggleDetails(date)} className="save-button">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table id={`details-${date}`} style={{ display: "none", marginTop: "10px", width: "100%" }} className="details-table">
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
          </div>
        ))
      )}
    </div>
  );
};

export default SalesList;
