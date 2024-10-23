import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs, getFirestore, orderBy } from 'firebase/firestore';

const db = getFirestore();

// Función para obtener los datos de ventas desde Firestore
const fetchSalesData = async (startDate, endDate) => {
    try {
        const salesQuery = query(
            collection(db, 'sales'),
            where('timestamp', '>=', startDate),
            where('timestamp', '<=', endDate),
            orderBy('timestamp', 'asc')  // Ordena los resultados por fecha
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

                // Realizar una consulta sin límite
                const salesList = await fetchSalesData(startOfPreviousWeek, endOfCurrentWeek);

                // Función para mapear ventas a una semana específica
                const salesMap = (salesList, weekRange) => {
                    const weeklySales = Array(7).fill(0);
                    salesList.forEach(({ timestamp, total }) => {
                        if (timestamp && timestamp >= weekRange[0] && timestamp <= weekRange[1]) {
                            const dayIndex = (timestamp.getDay() + 6) % 7; // Lunes = 0
                            weeklySales[dayIndex] += total;
                        }
                    });
                    return weeklySales;
                };

                // Procesar datos de ventas para ambas semanas
                const currentWeekSales = salesMap(salesList, [startOfCurrentWeek, endOfCurrentWeek]);
                const previousWeekSales = salesMap(salesList, [startOfPreviousWeek, endOfPreviousWeek]);

                setSalesData(currentWeekSales);
                setPreviousWeekData(previousWeekSales);

                const totalCurrentWeekSales = currentWeekSales.reduce((a, b) => a + b, 0);
                const totalPreviousWeekSales = previousWeekSales.reduce((a, b) => a + b, 0);

                // Solo actualiza el estado si es necesario
                if (setTotalWeeklySales && totalCurrentWeekSales !== salesData.reduce((a, b) => a + b, 0)) {
                    setTotalWeeklySales(totalCurrentWeekSales);
                }
                if (setTotalPreviousWeekSales && totalPreviousWeekSales !== previousWeekData.reduce((a, b) => a + b, 0)) {
                    setTotalPreviousWeekSales(totalPreviousWeekSales);
                }
            } catch (error) {
                console.error('Error al cargar los datos de ventas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSalesData();
    }, [setTotalWeeklySales, setTotalPreviousWeekSales]);

    // Usar memoización para evitar recargar los datos si no hay cambios
    const cachedSalesData = useMemo(() => salesData, [salesData]);
    const cachedPreviousWeekData = useMemo(() => previousWeekData, [previousWeekData]);

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
                data: cachedSalesData,
                type: 'bar',
                itemStyle: { color: '#FFAE00' }
            },
            {
                name: 'Semana Anterior',
                data: cachedPreviousWeekData,
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
