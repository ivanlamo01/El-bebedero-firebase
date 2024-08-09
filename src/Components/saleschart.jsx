import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSalesData } from '../Services/productosServices';

const SalesChart = ({ setTotalWeeklySales, setTotalPreviousWeekSales }) => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const loadSalesData = async () => {
            const salesList = await fetchSalesData();

            const currentDate = new Date();
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const startOfPreviousWeek = new Date(startOfWeek);
            startOfPreviousWeek.setDate(startOfWeek.getDate() - 7);

            const salesByDay = salesList.reduce((acc, sale) => {
                const saleDate = new Date(sale.date);
                const day = saleDate.getDay();
                if (saleDate >= startOfWeek) {
                    acc.currentWeek[day] = (acc.currentWeek[day] || 0) + sale.total;
                } else if (saleDate >= startOfPreviousWeek && saleDate < startOfWeek) {
                    acc.previousWeek[day] = (acc.previousWeek[day] || 0) + sale.total;
                }
                return acc;
            }, { currentWeek: {}, previousWeek: {} });

            const salesDataArray = Array.from({ length: 7 }, (_, i) => salesByDay.currentWeek[i] || 0);
            const totalWeeklySales = salesDataArray.reduce((total, daySales) => total + daySales, 0);

            const previousWeekSalesArray = Array.from({ length: 7 }, (_, i) => salesByDay.previousWeek[i] || 0);
            const totalPreviousWeekSales = previousWeekSalesArray.reduce((total, daySales) => total + daySales, 0);

            setSalesData(salesDataArray);
            setTotalWeeklySales(totalWeeklySales);
            setTotalPreviousWeekSales(totalPreviousWeekSales);
        };

        loadSalesData();
    }, [setTotalWeeklySales, setTotalPreviousWeekSales]);

    const option = {
        responsive: true,
        maintainAspectRatio: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value) => (value >= 1000 ? (value / 1000) + 'K' : value)
            }
        },
        series: [
            {
                data: salesData,
                type: 'bar',
                itemStyle: {
                    color: '#FFAE00'
                }
            }
        ]
    };

    return (
        <div className='chart1'>
            <ReactECharts option={option} />
        </div>
    );
};

export default SalesChart;
