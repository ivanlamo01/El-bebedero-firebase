import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSalesData, fetchExpensesData } from '../Services/productosServices';

const processData = (sales, expenses) => {
    const aggregatedData = {};

    const aggregate = (data, type) => {
        data.forEach(item => {
            if (!aggregatedData[item.date]) {
                aggregatedData[item.date] = { sales: 0, expenses: 0 };
            }
            aggregatedData[item.date][type] += item.total;
        });
    };

    aggregate(sales, 'sales');
    aggregate(expenses, 'expenses');

    return Object.entries(aggregatedData).map(([date, totals]) => ({
        date,
        sales: totals.sales,
        expenses: totals.expenses,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const SalesChartProfit = () => {
    const [data, setData] = useState({ sales: [], expenses: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sales, expenses] = await Promise.all([fetchSalesData(), fetchExpensesData()]);
                const processedData = processData(sales, expenses);
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

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    const option = {
        responsive: true,
        maintainAspectRatio: false,
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: data.dates,
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
                name: 'Ventas',
                type: 'line',
                data: data.sales,
                smooth: true,
                itemStyle: { color: 'green' },
            },
            {
                name: 'Gastos',
                type: 'line',
                data: data.expenses,
                smooth: true,
                itemStyle: { color: 'red' },
            },
        ],
    };

    return <ReactECharts option={option} />;
};

export default SalesChartProfit;
