import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
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
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan="4">No hay ventas disponibles</td>
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
                                            {sale.products && sale.products.length > 0 ? (
                                                sale.products.map((product, index) => {
                                                    // Verificación y conversión de precio
                                                    const price = parseFloat(product.price);
                                                    const displayPrice = !isNaN(price) ? `$${price.toFixed(2)}` : 'Precio no disponible';
                                                    return (
                                                        <li key={index}>
                                                            {product.title} - {displayPrice} x {product.quantity}
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <li>No hay productos disponibles</li>
                                            )}
                                        </ul>
                                    </details>
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
