import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import ReactECharts from 'echarts-for-react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const db = getFirestore();

const SalesChart = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const salesCollection = collection(db, 'sales');

        const unsubscribe = onSnapshot(salesCollection, (snapshot) => {
            const salesList = snapshot.docs.map(doc => doc.data());

            // Obtener el inicio de la semana actual
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            startOfWeek.setHours(0, 0, 0, 0); // Establecer el inicio de la semana a las 00:00:00

            // Filtrar ventas de la semana actual y agruparlas por día de la semana
            const salesByDay = salesList.reduce((acc, sale) => {
                if (sale.timestamp && sale.timestamp.toDate) {
                    const saleDate = sale.timestamp.toDate();
                    if (saleDate >= startOfWeek) {
                        const day = saleDate.getDay(); // 0 (Domingo) a 6 (Sábado)
                        acc[day] = (acc[day] || 0) + (Number(sale.total) || 0);
                    }
                }
                return acc;
            }, {});

            // Crear un arreglo con las ventas por día
            const salesDataArray = Array.from({ length: 7 }, (_, i) => salesByDay[i] || 0);
            setSalesData(salesDataArray);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    const option = {
        legend: {},
        tooltip: {},
        title: [
            {
              text: 'Ventas en la Ultima semana'
            }
          ],
        xAxis: {
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
