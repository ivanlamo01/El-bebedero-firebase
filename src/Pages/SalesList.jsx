import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import '../styles/salesList.css';

const db = getFirestore();

const SalesList = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'sales'));
                const salesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSales(salesList);
            } catch (error) {
                console.error("Error al obtener las ventas: ", error);
            }
        };

        fetchSales();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'sales', id));
            const updatedSales = sales.filter(sale => sale.id !== id);
            setSales(updatedSales);
        } catch (error) {
            console.error("Error al eliminar la venta: ", error);
        }
    };

    return (
        <div className="sales-list">
            <h1>Lista de Ventas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID de Venta</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                        <th>Detalles</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan="5">No hay ventas disponibles</td>
                        </tr>
                    ) : (
                        sales.map(sale => (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>${parseFloat(sale.total).toFixed(2)}</td>
                                <td>{sale.paymentMethod || 'Método de pago no disponible'}</td>
                                <td>
                                    <details>
                                        <summary>Ver Detalles</summary>
                                        <ul>
                                            <li>Fecha y Hora: {sale.timestamp ? new Date(sale.timestamp.seconds * 1000).toLocaleString() : 'Fecha no disponible'}</li>
                                            <li>Productos:
                                                <ul>
                                                    {sale.products && sale.products.length > 0 ? (
                                                        sale.products.map((product, index) => (
                                                            <li key={index}>
                                                                {product.title} - ${parseFloat(product.price).toFixed(2)} x {product.quantity}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No hay productos disponibles</li>
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>
                                    </details>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(sale.id)} className="delete-button">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SalesList;