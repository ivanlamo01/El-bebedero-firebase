import "../styles/main.css";
import SalesChart from "../Components/saleschart";
import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown} from 'react-icons/fa';
import SalesChartProfit from "../Components/graficoProfit";

function Graficos() {
  const [totalWeeklySales, setTotalWeeklySales] = useState(0);
  const [totalPreviousWeekSales, setTotalPreviousWeekSales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);

  const [alert, setAlert] = useState(null);


  useEffect(() => {
    if (totalPreviousWeekSales !== 0) {
      const change = ((totalWeeklySales - totalPreviousWeekSales) / totalPreviousWeekSales) * 100;
      setSalesChange(change.toFixed(2));
    } else {
      setSalesChange(totalWeeklySales > 0 ? 100 : 0);
    }
  }, [totalWeeklySales, totalPreviousWeekSales]);


  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return (
    <>
      <div className="cards">
        <div className="card1and2">
          <div className="Mainn">
          </div>
          <div className="card2">
            <h5>Total ventas de la semana:</h5>
            <div className="totalweek">
              <span>$</span><h1>{totalWeeklySales}</h1>
              <span className={salesChange >= 0 ? "positiveChange" : "negativeChange"}>
                {salesChange >= 0 ? <FaArrowUp /> : <FaArrowDown />} {salesChange}% a la semana anterior
              </span>
            </div>
            <SalesChart 
              setTotalWeeklySales={setTotalWeeklySales} 
              setTotalPreviousWeekSales={setTotalPreviousWeekSales} 
            />
          </div>
        </div>


          <div className="card5">
            <h4 > Comparacion de Ventas/Gastos diarios</h4>
                    <div className="chartProf">
                    <SalesChartProfit/>
                    </div>
          </div>
        </div>
    </>
  );
}

export default Graficos;
