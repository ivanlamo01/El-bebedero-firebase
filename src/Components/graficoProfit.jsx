import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSalesData, fetchExpensesData } from '../Services/productosServices';

const processData = (data) => {
    const aggregatedData = {};
    data.forEach((item) => {
        if (!aggregatedData[item.date]) {
            aggregatedData[item.date] = 0;
        }
        aggregatedData[item.date] += item.total;
    });
    return Object.entries(aggregatedData).map(([date, total]) => ({
        date,
        total,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const SalesChartProfit = () => {
    const [salesData, setSalesData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const sales = await fetchSalesData();
            const expenses = await fetchExpensesData();

            setSalesData(processData(sales));
            setExpensesData(processData(expenses));
        };

        loadData();
    }, []);

    const allDates = Array.from(new Set([
        ...salesData.map(item => item.date),
        ...expensesData.map(item => item.date),
    ])).sort((a, b) => new Date(a) - new Date(b));

    const salesDataMap = new Map(salesData.map(item => [item.date, item.total]));
    const expensesDataMap = new Map(expensesData.map(item => [item.date, item.total]));

    const salesDataArray = allDates.map(date => salesDataMap.get(date) || 0);
    const expensesDataArray = allDates.map(date => expensesDataMap.get(date) || 0);

    const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: allDates,
            name: 'Fecha',
        },
        yAxis: {
            type: 'value',
            name: 'Monto',
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
                data: salesDataArray,
                smooth: true,
                itemStyle: {
                    color: 'green',
                },
            },
            {
                name: 'Gastos',
                type: 'line',
                data: expensesDataArray,
                smooth: true,
                itemStyle: {
                    color: 'red',
                },
            },
        ],
    };

    return (
        <div>
            <ReactECharts option={option} />
        </div>
    );
};

export default SalesChartProfit;
