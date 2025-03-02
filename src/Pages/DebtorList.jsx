import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import "../styles/debtorList.css";

const db = getFirestore();

const DebtorsList = () => {
  const [debtors, setDebtors] = useState([]);
  const [newDebtorName, setNewDebtorName] = useState("");
  const [expandedDebtor, setExpandedDebtor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState();
  const [editedTotalAmount, setEditedTotalAmount] = useState();

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "debts"));
        const debtorsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedDebtors = debtorsList.reduce((acc, debtor) => {
          const name = debtor.name;
          if (!acc[name]) {
            acc[name] = { name, totalAmount: 0, debts: [] };
          }
          acc[name].totalAmount += debtor.amount;
          acc[name].debts.push(debtor);
          return acc;
        }, {});

        setDebtors(Object.values(groupedDebtors));
      } catch (error) {
        console.error("Error al obtener los deudores: ", error);
      }
    };

    fetchDebtors();
  }, []);

  const handleAddDebtor = async () => {
    if (!newDebtorName.trim()) return;
    if (debtors.some((d) => d.name === newDebtorName)) {
      alert("El deudor ya existe.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDebtRef = doc(collection(db, "debts"));
      await setDoc(newDebtRef, {
        name: newDebtorName,
        amount: 0,
        timestamp: new Date(),
        products: [],
      });

      setDebtors([
        ...debtors,
        { name: newDebtorName, totalAmount: 0, debts: [] },
      ]);
      setNewDebtorName("");

      alert("Deudor agregado exitosamente.");
    } catch (error) {
      console.error("Error al agregar el deudor: ", error);
    } finally {
      setLoading(false);
    }
  };
  const startEditingTotalAmount = (debtor) => {
    setEditingDebtor(debtor.name);
    setEditedTotalAmount(debtor.totalAmount);
  };
  const handleUpdateTotalAmount = async (debtorName, newTotalAmount) => {
    try {
      setLoading(true);
      const debtor = debtors.find((d) => d.name === debtorName);
      if (!debtor) return;

      const totalOldAmount = debtor.totalAmount;
      const totalDifference = parseFloat(newTotalAmount) - totalOldAmount;

      if (debtor.debts.length === 0) return;

      const distributedDifference = totalDifference / debtor.debts.length;

      await Promise.all(
        debtor.debts.map(async (debt) => {
          const updatedAmount = debt.amount + distributedDifference;
          const debtRef = doc(db, "debts", debt.id);
          await updateDoc(debtRef, { amount: updatedAmount });
        })
      );

      const updatedDebtors = debtors.map((d) =>
        d.name === debtorName
          ? { ...d, totalAmount: parseFloat(newTotalAmount) }
          : d
      );

      setDebtors(updatedDebtors);
      setEditingDebtor(null);
      setEditedTotalAmount("");
      alert("Total actualizado exitosamente."); // Alerta al finalizar
    } catch (error) {
      console.error("Error al actualizar el total de la deuda: ", error);
      alert("Error al actualizar la deuda.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDebt = async (debtId, debtorName) => {
    try {
      await deleteDoc(doc(db, "debts", debtId));
      const updatedDebtors = debtors.map((d) => {
        if (d.name === debtorName) {
          const updatedDebts = d.debts.filter((debt) => debt.id !== debtId);
          const updatedTotalAmount = updatedDebts.reduce(
            (total, debt) => total + debt.amount,
            0
          );
          return { ...d, debts: updatedDebts, totalAmount: updatedTotalAmount };
        }
        return d;
      });
      setDebtors(updatedDebtors);
    } catch (error) {
      console.error("Error al eliminar la deuda: ", error);
    }
  };
  const handleDeleteDebtor = async (debtorName) => {
    try {
      const debtor = debtors.find((d) => d.name === debtorName);
      if (!debtor) return;

      // Eliminar todas las deudas del deudor en Firestore
      await Promise.all(
        debtor.debts.map(async (debt) => {
          const debtRef = doc(db, "debts", debt.id);
          await deleteDoc(debtRef);
        })
      );

      // Filtrar al deudor eliminado de la lista local
      const updatedDebtors = debtors.filter((d) => d.name !== debtorName);
      setDebtors(updatedDebtors);
      setEditingDebtor(null);
    } catch (error) {
      console.error("Error al eliminar el deudor: ", error);
    }
  };

  const toggleDetails = (name) => {
    setExpandedDebtor(expandedDebtor === name ? null : name);
  };

  return (
    <div className="debtors-list">
      <div className="separador">DEUDAS</div>
      <div className="add-debtor">
        <input
          className="input"
          type="text"
          value={newDebtorName}
          onChange={(e) => setNewDebtorName(e.target.value)}
          placeholder="Nombre del nuevo deudor"
          style={{ width: "20%", padding: "10px", margin: "1%" }}
        />
        <button
          onClick={handleAddDebtor}
          className="save-button"
          disabled={loading}
        >
          {loading ? "Agregando..." : "Agregar Deudor"}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {debtors.map((debtor) => (
            <React.Fragment key={debtor.name}>
              <tr>
                <td>{debtor.name}</td>
                <td>${debtor.totalAmount.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => toggleDetails(debtor.name)}
                    className="save-button"
                  >
                    {expandedDebtor === debtor.name
                      ? "Ocultar Detalles"
                      : "Ver Detalles"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => startEditingTotalAmount(debtor)}
                    className="save-button"
                  >
                    Editar Total
                  </button>
                </td>
              </tr>
              {expandedDebtor === debtor.name && (
                <tr>
                  <td colSpan="3">
                    <ul>
                      {debtor.debts.map((debt, index) => (
                        <li key={index}>
                          <div>
                            Fecha y Hora:{" "}
                            {new Date(
                              debt.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </div>
                          <div>Monto: ${debt.amount.toFixed(2)}</div>
                          <div>Productos:</div>
                          <ul>
                            {debt.products &&
                              debt.products.map((product, idx) => (
                                <li key={idx}>
                                  {product.name} - $
                                  {parseFloat(product.price).toFixed(2)} x{" "}
                                  {product.quantity}
                                </li>
                              ))}
                          </ul>
                          <button
                            onClick={() =>
                              handleDeleteDebt(debt.id, debtor.name)
                            }
                            className="delete-button"
                          >
                            Eliminar Deuda
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {editingDebtor && (
        <div className="edit-modal">
          <h2>Editar Total para {editingDebtor}</h2>
          <input
            type="number"
            value={editedTotalAmount}
            onChange={(e) => setEditedTotalAmount(e.target.value)}
            placeholder="Nuevo total"
          />
          <button
            onClick={() =>
              handleUpdateTotalAmount(editingDebtor, editedTotalAmount)
            }
            className="save-button"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => setEditingDebtor(null)}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleDeleteDebtor(editingDebtor)}
            className="cancel-button"
          >
            Eliminar Deudor
          </button>
        </div>
      )}
    </div>
  );
};

export default DebtorsList;
