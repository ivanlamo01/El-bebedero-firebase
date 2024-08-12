import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore();

// Función para obtener los datos de ventas desde Firestore
const fetchSalesData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toDate() : null, // Convertir Firestore Timestamp a Date si existe
                total: Number(data.total) || 0
            };
        });
        return salesList;
    } catch (error) {
        console.error("Error al obtener los datos de ventas:", error);
        return [];
    }
};

// Función para obtener el inicio de la semana (lunes)
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Domingo) - 6 (Sábado)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste si el día es domingo
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Función para obtener el fin de la semana (domingo)
function getEndOfWeek(date) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo
    endOfWeek.setHours(23, 59, 59, 999); // Fin del domingo
    return endOfWeek;
}

const SalesChart = ({ setTotalWeeklySales, setTotalPreviousWeekSales }) => {
    const [salesData, setSalesData] = useState(Array(7).fill(0)); // Semana actual
    const [previousWeekData, setPreviousWeekData] = useState(Array(7).fill(0)); // Semana anterior
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSalesData = async () => {
            try {
                const salesList = await fetchSalesData();
                console.log("Ventas obtenidas:", salesList);

                const today = new Date();
                const startOfCurrentWeek = getStartOfWeek(today); // Lunes actual
                const endOfCurrentWeek = getEndOfWeek(today); // Domingo actual

                const startOfPreviousWeek = new Date(startOfCurrentWeek);
                startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
                const endOfPreviousWeek = new Date(endOfCurrentWeek);
                endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7);

                // Inicializar arrays para las ventas
                const currentWeekSales = Array(7).fill(0); // Lunes a domingo
                const previousWeekSales = Array(7).fill(0);

                salesList.forEach(sale => {
                    if (!sale.timestamp) {
                        // Omitir si no hay timestamp
                        console.warn(`Venta sin timestamp: ${sale.id}`);
                        return;
                    }
                    const saleDate = sale.timestamp; // Ya es un objeto Date
                    saleDate.setHours(0, 0, 0, 0); // Normalizar hora

                    if (saleDate >= startOfCurrentWeek && saleDate <= endOfCurrentWeek) {
                        const dayIndex = (saleDate.getDay() + 6) % 7; // Ajustar para que lunes=0
                        currentWeekSales[dayIndex] += Number(sale.total);
                    } else if (saleDate >= startOfPreviousWeek && saleDate <= endOfPreviousWeek) {
                        const dayIndex = (saleDate.getDay() + 6) % 7; // Lunes=0
                        previousWeekSales[dayIndex] += Number(sale.total);
                    }
                });

                console.log("Ventas de la semana actual por día:", currentWeekSales);
                console.log("Ventas de la semana anterior por día:", previousWeekSales);

                const totalCurrentWeekSales = currentWeekSales.reduce((a, b) => a + b, 0);
                const totalPreviousWeekSales = previousWeekSales.reduce((a, b) => a + b, 0);

                setSalesData(currentWeekSales);
                setPreviousWeekData(previousWeekSales);
                setTotalWeeklySales && setTotalWeeklySales(totalCurrentWeekSales);
                setTotalPreviousWeekSales && setTotalPreviousWeekSales(totalPreviousWeekSales);
            } catch (error) {
                console.error("Error al cargar los datos de ventas:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSalesData();
    }, [setTotalWeeklySales, setTotalPreviousWeekSales]);

    if (loading) {
        return <div>Cargando datos de ventas...</div>;
    }

    const option = {
        responsive: true,
        maintainAspectRatio: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Semana Actual', 'Semana Anterior']
        },
        xAxis: {
            type: 'category',
            data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value) => (value >= 1000 ? (value / 1000) + 'K' : value)
            }
        },
        series: [
            {
                name: 'Semana Actual',
                data: salesData,
                type: 'bar',
                itemStyle: {
                    color: '#FFAE00'
                }
            },
            {
                name: 'Semana Anterior',
                data: previousWeekData,
                type: 'bar',
                itemStyle: {
                    color: '#00AEFF'
                }
            }
        ]
    };

    return (
        <div className='chart1'>
            <ReactECharts option={option} style={{ height: '400px', width: '100%' }}/>
        </div>
    );
};

export default SalesChart;
