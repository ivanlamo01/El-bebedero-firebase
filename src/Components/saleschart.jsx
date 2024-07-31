import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Chart } from 'react-charts';

const db = getFirestore();

const SalesChart = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'sales'));
                const salesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Agrupar ventas por día
                const salesByDate = salesList.reduce((acc, sale) => {
                    if (sale.timestamp && sale.timestamp.seconds) {
                        const date = new Date(sale.timestamp.seconds * 1000).toLocaleDateString();
                        if (!acc[date]) {
                            acc[date] = 0;
                        }
                        acc[date] += parseFloat(sale.total) || 0;
                    } else {
                        console.error("Fecha inválida en la venta: ", sale);
                    }
                    return acc;
                }, {});

                const data = Object.entries(salesByDate).map(([date, total]) => ({
                    date: new Date(date),
                    total
                }));

                setSalesData(data);
            } catch (error) {
                console.error("Error al obtener las ventas: ", error);
            }
        };

        fetchSales();
    }, []);

    const chartData = useMemo(
        () => [
            {
                label: 'Ventas por Día',
                data: salesData.map(({ date, total }) => ({
                    primary: date,
                    secondary: total
                })),
            },
        ],
        [salesData]
    );

    const primaryAxis = useMemo(
        () => ({
            getValue: datum => datum.primary,
            scaleType: 'time',
            // Configuración adicional
        }),
        []
    );

    const secondaryAxes = useMemo(
        () => [
            {
                getValue: datum => datum.secondary,
                scaleType: 'linear',
                // Configuración adicional
            },
        ],
        []
    );

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <h2>Ventas por Día</h2>
            <Chart
                options={{
                    data: chartData,
                    primaryAxis,
                    secondaryAxes,
                }}
            />
        </div>
    );
};

export default SalesChart;
