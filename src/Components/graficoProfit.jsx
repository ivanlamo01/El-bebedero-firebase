import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSalesData, fetchExpensesData } from '../Services/productosServices';

const processData = (sales, expenses) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Usa un solo objeto para almacenar datos agregados por fecha
    const aggregatedData = sales.concat(expenses).reduce((acc, item) => {
        const itemDate = new Date(item.date);  // Asegúrate de que sea una fecha válida

        if (itemDate >= oneMonthAgo) {  // Filtra los datos del último mes
            const dateStr = item.date;
            if (!acc[dateStr]) {
                acc[dateStr] = { sales: 0, expenses: 0 };
            }
            if (item.total && item.products) {  // Si es una venta
                acc[dateStr].sales += item.total;
            } else {  // Si es un gasto
                acc[dateStr].expenses += item.total;
            }
        }
        return acc;
    }, {});

    // Devuelve el array de datos procesados
    return Object.entries(aggregatedData)
        .map(([date, totals]) => ({
            date,
            sales: totals.sales,
            expenses: totals.expenses,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const SalesChartProfit = () => {
    const [data, setData] = useState({ sales: [], expenses: [], dates: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sales, expenses] = await Promise.all([fetchSalesData(), fetchExpensesData()]);

                // Procesa y filtra los datos una sola vez
                const processedData = processData(sales, expenses);

                // Actualiza el estado una sola vez con los datos procesados
                setData({
                    sales: processedData.map(item => item.sales),
                    expenses: processedData.map(item => item.expenses),
                    dates: processedData.map(item => item.date),
                });
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Usa memoización para evitar recálculos innecesarios
    const cachedSalesData = useMemo(() => data.sales, [data.sales]);
    const cachedExpensesData = useMemo(() => data.expenses, [data.expenses]);
    const cachedDates = useMemo(() => data.dates, [data.dates]);

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    const option = {
        responsive: true,
        maintainAspectRatio: false,
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: cachedDates,
            name: 'Fecha',
        },
        yAxis: {
            type: 'value',
            name: 'Monto',
            axisLabel: {
                formatter: value => (value >= 1000 ? (value / 1000) + 'K' : value),
            },
        },
        dataZoom: [
            {
                type: 'slider',
                start: 0,
                end: 100,
            },
        ],
        series: [
            {
                name: 'Gastos',
                type: 'line',
                data: cachedExpensesData,
                smooth: true,
                itemStyle: { color: 'green' },
            },
            {
                name: 'Ventas',
                type: 'line',
                data: cachedSalesData,
                smooth: true,
                itemStyle: { color: 'red' },
            },
        ],
    };

    return <ReactECharts option={option} />;
};

export default SalesChartProfit;
