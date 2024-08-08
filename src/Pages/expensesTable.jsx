import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import '../styles/expensesTable.css'; // Asegúrate de incluir el archivo CSS

const db = getFirestore();

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);

  useEffect(() => {
    const loadExpenses = async () => {
      const q = query(
        collection(db, "expenses"),
        orderBy("date", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const expensesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesList);
    };

    loadExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      if (isEditMode && currentExpenseId) {
        const expenseRef = doc(db, "expenses", currentExpenseId);
        await updateDoc(expenseRef, newExpense);
        setExpenses(expenses.map(exp => exp.id === currentExpenseId ? { id: currentExpenseId, ...newExpense } : exp));
      } else {
        const expenseRef = await addDoc(collection(db, "expenses"), newExpense);
        setExpenses([...expenses, { id: expenseRef.id, ...newExpense }]);
      }
      setNewExpense({ description: "", amount: "", date: "" });
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentExpenseId(null);
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };
const handleEdit=()=>{
  setIsEditMode(true)
  setIsModalOpen(true)
}
  const closeModal = () => {
    setNewExpense({ description: "", amount: "", date: "" });
    setIsEditMode(false);
    setCurrentExpenseId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="expenses-list">
      <div className="separador">Últimos gastos</div>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.description}</td>
              <td>${parseFloat(expense.amount).toFixed(2)}</td>
              <td>{new Date(expense.date).toLocaleString()}</td>
              <td>
                <button onClick={handleEdit}  className="addbutton">Editar</button>
                <button onClick={() => handleDeleteExpense(expense.id)}className="close-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="addbutton" onClick={handleModal}>Agregar Gasto</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modala">
            <h4>Agregar Gasto</h4>
            <input
              type="text"
              placeholder="Descripción"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              className="input"
              required
            />
            <input
              type="number"
              placeholder="Monto"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              className="input"
              required
            />
            <input
              type="datetime-local"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              className="input"
              required
            />
            <button onClick={handleAddExpense} className="addbutton">{isEditMode ? "Guardar Cambios" : "Agregar Gasto"}</button>
            <button onClick={closeModal} className="close-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesTable;
