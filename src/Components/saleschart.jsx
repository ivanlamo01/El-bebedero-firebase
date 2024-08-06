import React, { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import ReactECharts from 'echarts-for-react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const db = getFirestore();

const SalesChart = ({ setTotalWeeklySales, setTotalPreviousWeekSales }) => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const salesCollection = collection(db, 'sales');

        const unsubscribe = onSnapshot(salesCollection, (snapshot) => {
            const salesList = snapshot.docs.map(doc => doc.data());

            // Obtener el inicio de la semana actual y de la semana anterior
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            startOfWeek.setHours(0, 0, 0, 0); // Establecer el inicio de la semana a las 00:00:00

            const startOfPreviousWeek = new Date(startOfWeek);
            startOfPreviousWeek.setDate(startOfWeek.getDate() - 7); // Una semana antes

            // Filtrar ventas de la semana actual y la semana anterior y agruparlas por día de la semana
            const salesByDay = salesList.reduce((acc, sale) => {
                if (sale.timestamp && sale.timestamp.toDate) {
                    const saleDate = sale.timestamp.toDate();
                    const day = saleDate.getDay(); // 0 (Domingo) a 6 (Sábado)
                    if (saleDate >= startOfWeek) {
                        acc.currentWeek[day] = (acc.currentWeek[day] || 0) + (Number(sale.total) || 0);
                    } else if (saleDate >= startOfPreviousWeek && saleDate < startOfWeek) {
                        acc.previousWeek[day] = (acc.previousWeek[day] || 0) + (Number(sale.total) || 0);
                    }
                }
                return acc;
            }, { currentWeek: {}, previousWeek: {} });

            // Crear arreglos con las ventas por día y calcular los totales semanales
            const salesDataArray = Array.from({ length: 7 }, (_, i) => salesByDay.currentWeek[i] || 0);
            const totalWeeklySales = salesDataArray.reduce((total, daySales) => total += daySales, 0);

            const previousWeekSalesArray = Array.from({ length: 7 }, (_, i) => salesByDay.previousWeek[i] || 0);
            const totalPreviousWeekSales = previousWeekSalesArray.reduce((total, daySales) => total += daySales, 0);

            setSalesData(salesDataArray);
            setTotalWeeklySales(totalWeeklySales);
            setTotalPreviousWeekSales(totalPreviousWeekSales);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [setTotalWeeklySales, setTotalPreviousWeekSales]);

    const option = {
        xAxis: {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {},
            type: 'category',
            data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        yAxis: {
            type: 'value'
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
        <div>
            <ReactECharts option={option} />
        </div>
    );
};

export default SalesChart;
