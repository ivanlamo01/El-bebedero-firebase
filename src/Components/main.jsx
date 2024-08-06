import "../styles/main.css";
import SalesChart from "./saleschart";

const style = {
  main: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    borderRadius: "20px",
  },
  text: {
    color: "white",
    fontWeight: "700",
  },
};

function Main() {
  return (
    <>
      <div className="cards">
        <div className="card1and2">
          <div style={style.main} className="Main">
            <div style={style.text}>
              <h2 style={{color:"#FFAE00" }}>Bienvenido, <span>Nahuel</span></h2>
              <h2 >Sistema Punto de Venta</h2>
            </div>

          </div>
          <div className="card2">
          <SalesChart />
          </div>
        </div>
        <div className="lastSales">

        </div>
      </div>
    </>
  );
}

export default Main;
