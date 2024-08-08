import "../styles/main.css";
import SalesChart from "./saleschart";
import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaPlus, FaTimes, FaArrowLeft, FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, getDocs, deleteDoc, limit,orderBy, } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Spinner, Alert, Carousel } from "react-bootstrap";
import InventoryTable from './inventoryTable';
import AdditionsTable from './additionsTable';
import ExpensesTable from '../Pages/expensesTable';

const db = getFirestore();
const auth = getAuth();

function Main() {
  const [totalWeeklySales, setTotalWeeklySales] = useState(0);
  const [totalPreviousWeekSales, setTotalPreviousWeekSales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [user, setUser] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const tasksPerPage = 2;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadTasks(currentUser.uid);
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadTasks = async (userId) => {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const userTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(userTasks);
  };

  useEffect(() => {
    if (totalPreviousWeekSales !== 0) {
      const change = ((totalWeeklySales - totalPreviousWeekSales) / totalPreviousWeekSales) * 100;
      setSalesChange(change.toFixed(2));
    } else {
      setSalesChange(totalWeeklySales > 0 ? 100 : 0);
    }
  }, [totalWeeklySales, totalPreviousWeekSales]);

  const handleAddTask = async () => {
    if (newTask && taskDeadline && user) {
      setLoading(true);
      try {
        const task = {
          description: newTask,
          deadline: taskDeadline,
          userId: user.uid,
        };
        const taskRef = await addDoc(collection(db, 'tasks'), task);
        setTasks([...tasks, { id: taskRef.id, ...task }]);
        setNewTask("");
        setTaskDeadline("");
        setIsAddingTask(false);
        setAlert({ variant: "success", text: "Tarea agregada correctamente" });
      } catch (error) {
        setAlert({ variant: "danger", text: "Error al agregar la tarea" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTask = async () => {
    if (currentTask && user) {
      setLoading(true);
      try {
        const taskRef = doc(db, 'tasks', currentTask.id);
        await updateDoc(taskRef, currentTask);
        setTasks(tasks.map(task => task.id === currentTask.id ? currentTask : task));
        setIsEditingTask(false);
        setCurrentTask(null);
        setAlert({ variant: "success", text: "Tarea actualizada" });
      } catch (error) {
        setAlert({ variant: "danger", text: "Error al actualizar la tarea" });
      } finally {
        setLoading(false);
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(tasks.filter(task => task.id !== taskId));
      setAlert({ variant: "success", text: "Tarea eliminada" });
    } catch (error) {
      setAlert({ variant: "danger", text: "Error al eliminar la tarea" });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(tasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedTasks = tasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  useEffect(() => {
    const loadExpenses = async () => {
      const q = query(
        collection(db, "expenses"),
        orderBy("date", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const expensesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesList);
    };

    loadExpenses();
  }, []);
  if (!user) {
    return <div className="Main"><h5>Por favor, inicia sesión para ver tus tareas.</h5></div>;
  }

  return (
    <>
      <div className="cards">
        <div className="card1and2">
          <div className="Main">
            <div className="text">
              <h5>Bienvenido, <span style={{color:"#FFAE00"}}>{user.nombre || user.email} &#128075;</span></h5>
              <h2>Vista General</h2>
            </div>
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

        <div className="card345">
          <div className="card34">
            <div className="card3">
              <Carousel>
                <Carousel.Item>
                  <InventoryTable />
                </Carousel.Item>
                <Carousel.Item>
                  <AdditionsTable />
                </Carousel.Item>
                <Carousel.Item>
                <h5>Últimos Gastos</h5>
                <table className="tableCar">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.description}</td>
              <td>${parseFloat(expense.amount).toFixed(2)}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
                </Carousel.Item>
              </Carousel>
            </div>
            
            <div className="card4">
              <div className="addtask">
                <h5 style={{marginRight:"20px"}}>Listado de tareas</h5>
                <button onClick={() => setIsAddingTask(!isAddingTask)} className="buttonadd">
                  {isAddingTask ? <FaTimes className="buttondel" /> : 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}className="buttonadd" color={"white"} fill={"none"}>
                    <path d="M18 15L18 22M21.5 18.5L14.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 16H11M7 11H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6.5 3.5C4.9442 3.54667 4.01661 3.71984 3.37477 4.36227C2.49609 5.24177 2.49609 6.6573 2.49609 9.48836L2.49609 15.9944C2.49609 18.8255 2.49609 20.241 3.37477 21.1205C4.25345 22 5.66767 22 8.49609 22H11.5M15.4922 3.5C17.048 3.54667 17.9756 3.71984 18.6174 4.36228C19.4961 5.24177 19.4961 6.6573 19.4961 9.48836V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6.49609 3.75C6.49609 2.7835 7.2796 2 8.24609 2H13.7461C14.7126 2 15.4961 2.7835 15.4961 3.75C15.4961 4.7165 14.7126 5.5 13.7461 5.5H8.24609C7.2796 5.5 6.49609 4.7165 6.49609 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>}
                </button>
              </div>
              {(isAddingTask || isEditingTask) && (
                <div className="overlay" onClick={() => { setIsAddingTask(false); setIsEditingTask(false); setCurrentTask(null); }}>
                  <div className="input-field" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      placeholder="Nueva tarea" 
                      value={isEditingTask ? currentTask.description : newTask}
                      onChange={(e) => isEditingTask ? setCurrentTask({ ...currentTask, description: e.target.value }) : setNewTask(e.target.value)}
                      className="input"
                    />
                    <input 
                      className="input"
                      type="datetime-local" 
                      value={isEditingTask ? currentTask.deadline : taskDeadline}
                      onChange={(e) => isEditingTask ? setCurrentTask({ ...currentTask, deadline: e.target.value }) : setTaskDeadline(e.target.value)}
                    />
                    <button onClick={isEditingTask ? handleEditTask : handleAddTask} disabled={loading} className="savebtn">
                      {loading && <Spinner animation="border" size="sm" />}
                      {isEditingTask ? "Guardar Cambios" : "Agregar Tarea"}
                    </button>
                  </div>
                </div>
              )}
              {alert && (
                <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>
                  {alert.text}
                </Alert>
              )}
              <ul className="tasklist">
                {displayedTasks.map((task) => (
                  <li key={task.id} className="task">
                    <span>{task.description} - {new Date(task.deadline).toLocaleString()}</span>
                    <div className="task-buttons">
                      <button onClick={() => { setIsEditingTask(true); setCurrentTask(task); }} className="buttonedit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="buttondel">
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pagination">
                <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                  <FaArrowLeft />
                </button>
                <span>{currentPage} de {Math.ceil(tasks.length / tasksPerPage)}</span>
                <button onClick={() => handlePageChange("next")} disabled={currentPage === Math.ceil(tasks.length / tasksPerPage)}>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="card5">
            <h5>Inventario</h5>
            <button><FaPlus /></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
