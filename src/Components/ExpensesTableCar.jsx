import { collection, query, getDocs, limit,orderBy, getFirestore} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
const db = getFirestore();

const ExpensesTableCar = () => {
  const [expenses, setExpenses] = useState([]);

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


  return (
    <>
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
    </>
  );
}
;
export default ExpensesTableCar;