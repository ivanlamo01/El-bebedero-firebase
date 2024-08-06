import "../styles/main.css";
import SalesChart from "./saleschart";
import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const style = {
  main: {
    width: "100%",
    display: "flex",
    borderRadius: "20px",
  },
  positiveChange: {
    color: "green",
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  negativeChange: {
    color: "red",
    display: "flex",
    alignItems: "center",
  },
};

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadTasks(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadTasks = async (userId) => {
    const userDoc = doc(db, 'Usuarios', userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData.tasks) {
        setTasks(userData.tasks);
      }
    } else {
      // If the document doesn't exist, create it with an empty task array
      await setDoc(userDoc, { tasks: [] });
    }
  };

  useEffect(() => {
    if (user) {
      const updateTasks = async () => {
        const userDoc = doc(db, 'Usuarios', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          await updateDoc(userDoc, { tasks });
        } else {
          await setDoc(userDoc, { tasks });
        }
      };
      updateTasks();
    }
  }, [tasks, user]);

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
      setSalesChange(totalWeeklySales > 0 ? 100 : 0); // 100% increase if no sales last week, else 0%
    }
  }, [totalWeeklySales, totalPreviousWeekSales]);

  const handleAddTask = async () => {
    if (newTask && taskDeadline && user) {
      const task = {
        id: tasks.length + 1,
        description: newTask,
        deadline: taskDeadline,
      };
      const userDoc = doc(db, 'Usuarios', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) {
        await setDoc(userDoc, { tasks: [task] });
      } else {
        await updateDoc(userDoc, { tasks: arrayUnion(task) });
      }
      setTasks([...tasks, task]);
      setNewTask("");
      setTaskDeadline("");
    }
  };

  return (
    <>
      <div className="cards">
        <div className="card1and2">
          <div style={style.main} className="Main">
            <div className="text">
              <h5>Bienvenido, <span>Nahuel &#128075;</span></h5>
              <h2>Vista General</h2>
            </div>
          </div>
          <div className="card2">
            <h5>Total ventas de la semana:</h5>
            <div className="totalweek">
              <span>$</span><h1>{totalWeeklySales}</h1>
              <span style={salesChange >= 0 ? style.positiveChange : style.negativeChange}>
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
              <h5>Listado de tareas</h5>
              <input 
                type="text" 
                placeholder="Nueva tarea" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <input 
                type="datetime-local" 
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
              />
              <button onClick={handleAddTask}>Agregar tarea</button>
              <ul className="tasklist">
                {tasks.map(task => (
                  <li key={task.id} className="task">
                    {task.description} - {new Date(task.deadline).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card5"></div>
        </div>
      </div>
    </>
  );
}

export default Main;
