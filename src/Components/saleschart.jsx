import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

const db = getFirestore();

// Función para obtener los datos de ventas desde Firestore
const fetchSalesData = async (startDate, endDate) => {
    try {
        const salesQuery = query(
            collection(db, 'sales'),
            where('timestamp', '>=', startDate),
            where('timestamp', '<=', endDate)
        );
        const querySnapshot = await getDocs(salesQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || null,
            total: Number(doc.data().total) || 0
        }));
    } catch (error) {
        console.error('Error al obtener los datos de ventas:', error);
        return [];
    }
};

// Función para obtener el inicio y fin de una semana
const getWeekRange = (date, offset = 0) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return [startOfWeek, endOfWeek];
};

const SalesChart = ({ setTotalWeeklySales, setTotalPreviousWeekSales }) => {
    const [salesData, setSalesData] = useState(Array(7).fill(0)); // Semana actual
    const [previousWeekData, setPreviousWeekData] = useState(Array(7).fill(0)); // Semana anterior
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSalesData = async () => {
            try {
                const today = new Date();
                const [startOfCurrentWeek, endOfCurrentWeek] = getWeekRange(today);
                const [startOfPreviousWeek, endOfPreviousWeek] = getWeekRange(today, -1);

                // Realizar una consulta para obtener todas las ventas dentro del rango
                const salesList = await fetchSalesData(startOfCurrentWeek, endOfCurrentWeek);
                const previousWeekSalesList = await fetchSalesData(startOfPreviousWeek, endOfPreviousWeek);

                const salesMap = (salesList) => {
                    const weeklySales = Array(7).fill(0);
                    salesList.forEach(({ timestamp, total }) => {
                        if (timestamp) {
                            const dayIndex = (timestamp.getDay() + 6) % 7; // Lunes = 0
                            weeklySales[dayIndex] += total;
                        }
                    });
                    return weeklySales;
                };

                // Procesar datos de ventas
                const currentWeekSales = salesMap(salesList);
                const previousWeekSales = salesMap(previousWeekSalesList);

                setSalesData(currentWeekSales);
                setPreviousWeekData(previousWeekSales);

                const totalCurrentWeekSales = currentWeekSales.reduce((a, b) => a + b, 0);
                const totalPreviousWeekSales = previousWeekSales.reduce((a, b) => a + b, 0);

                if (setTotalWeeklySales) setTotalWeeklySales(totalCurrentWeekSales);
                if (setTotalPreviousWeekSales) setTotalPreviousWeekSales(totalPreviousWeekSales);
            } catch (error) {
                console.error('Error al cargar los datos de ventas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSalesData();
    }, [setTotalWeeklySales, setTotalPreviousWeekSales]);

    if (loading) {
        return (
            <div className='loading-overlay'>
                <Spinner animation='border' />
                <p>Cargando...</p>
            </div>
        );
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
                formatter: value => (value >= 1000 ? (value / 1000) + 'K' : value)
            }
        },
        series: [
            {
                name: 'Semana Actual',
                data: salesData,
                type: 'bar',
                itemStyle: { color: '#FFAE00' }
            },
            {
                name: 'Semana Anterior',
                data: previousWeekData,
                type: 'bar',
                itemStyle: { color: '#00AEFF' }
            }
        ]
    };

    return (
        <div className='chart1'>
            <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </div>
    );
};

export default SalesChart;
