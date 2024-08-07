import "../styles/main.css";
import SalesChart from "./saleschart";
import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaPlus, FaTimes, FaArrowLeft, FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Spinner } from "react-bootstrap";
import { Alert } from "react-bootstrap";

const db = getFirestore();
const auth = getAuth();

function Main() {
  const [totalWeeklySales, setTotalWeeklySales] = useState(0);
  const [totalPreviousWeekSales, setTotalPreviousWeekSales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [nearestTask, setNearestTask] = useState(null);
  const [user, setUser] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
    if (tasks.length > 0) {
      const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setNearestTask(sortedTasks[0]);
    } else {
      setNearestTask(null);
    }
  }, [tasks]);

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

  if (!user) {
    return <div className="Main"><h5>Por favor, inicia sesión para ver tus tareas.</h5></div>;
  }

  return (
    <>
      <div className="cards">
        <div className="card1and2">
          <div className="Main">
            <div className="text">
              <h5>Bienvenido, <span>{user.nombre || user.email} &#128075;</span></h5>
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
              <h5>Tarea más próxima</h5>
              {nearestTask ? (
                <div>
                  <p>{nearestTask.description}</p>
                  <p>Fecha límite: {new Date(nearestTask.deadline).toLocaleString()}</p>
                </div>
              ) : (
                <p>No hay tareas próximas</p>
              )}
            </div>
            
            <div className="card4">
              <div className="addtask">
                <h5 style={{marginRight:"20px"}}>Listado de tareas</h5>
                <button onClick={() => setIsAddingTask(!isAddingTask)} className="buttonadd">
                  {isAddingTask ? <FaTimes className="buttondel" /> : <FaPlus />}
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
              {alert && <Alert variant={alert.variant}>{alert.text}</Alert>}
              <ul className="tasklist">
                {displayedTasks.map(task => (
                  <li key={task.id} className="task">
                    <div>
                      <div className="bot">
                        <span>{task.description}</span>
                        <button onClick={() => { setIsEditingTask(true); setCurrentTask(task); }} className="buttonedit">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="buttondel">
                          <FaTrash />
                        </button>
                      </div>
                      <span> {new Date(task.deadline).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pagination">
                <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                  <FaArrowLeft />
                </button>
                <span>Página {currentPage} de {Math.ceil(tasks.length / tasksPerPage)}</span>
                <button onClick={() => handlePageChange("next")} disabled={currentPage === Math.ceil(tasks.length / tasksPerPage)}>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
          <div className="card5">
            <h5>Últimas ventas</h5>
            <div className="lastSales"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
