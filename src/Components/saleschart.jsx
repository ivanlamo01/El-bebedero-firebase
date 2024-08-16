
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore();

// Función para obtener los datos de ventas desde Firestore
const fetchSalesData = async (startDate, endDate) => {
    try {
        const salesQuery = query(
            collection(db, "sales"),
            where("timestamp", ">=", startDate),
            where("timestamp", "<=", endDate)
        );
        const querySnapshot = await getDocs(salesQuery);
        const salesList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toDate() : null,
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
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Función para obtener el fin de la semana (domingo)
function getEndOfWeek(date) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
}

const SalesChart = ({ setTotalWeeklySales, setTotalPreviousWeekSales }) => {
    const [salesData, setSalesData] = useState(Array(7).fill(0)); // Semana actual
    const [previousWeekData, setPreviousWeekData] = useState(Array(7).fill(0)); // Semana anterior
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSalesData = async () => {
            try {
                const today = new Date();
                const startOfCurrentWeek = getStartOfWeek(today);
                const endOfCurrentWeek = getEndOfWeek(today);

                const startOfPreviousWeek = new Date(startOfCurrentWeek);
                startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
                const endOfPreviousWeek = new Date(endOfCurrentWeek);
                endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7);

                // Realizar consultas específicas para cada semana
                const [currentWeekSalesList, previousWeekSalesList] = await Promise.all([
                    fetchSalesData(startOfCurrentWeek, endOfCurrentWeek),
                    fetchSalesData(startOfPreviousWeek, endOfPreviousWeek)
                ]);

                const currentWeekSales = Array(7).fill(0);
                const previousWeekSales = Array(7).fill(0);

                // Procesar ventas de la semana actual
                currentWeekSalesList.forEach(sale => {
                    const saleDate = sale.timestamp;
                    saleDate.setHours(0, 0, 0, 0);
                    const dayIndex = (saleDate.getDay() + 6) % 7; // Lunes=0
                    currentWeekSales[dayIndex] += Number(sale.total);
                });

                // Procesar ventas de la semana anterior
                previousWeekSalesList.forEach(sale => {
                    const saleDate = sale.timestamp;
                    saleDate.setHours(0, 0, 0, 0);
                    const dayIndex = (saleDate.getDay() + 6) % 7;
                    previousWeekSales[dayIndex] += Number(sale.total);
                });

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