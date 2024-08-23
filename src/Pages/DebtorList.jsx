import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import '../styles/debtorList.css';

const db = getFirestore();

const DebtorsList = () => {
    const [debtors, setDebtors] = useState([]);
    const [expandedDebtor, setExpandedDebtor] = useState(null);
    const [editingDebtor, setEditingDebtor] = useState(null);
    const [editedTotalAmount, setEditedTotalAmount] = useState('');

    useEffect(() => {
        const fetchDebtors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'debts'));
                const debtorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Agrupar deudores por nombre
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

    const handleUpdateTotalAmount = async (debtorName, newTotalAmount) => {
        try {
            const debtor = debtors.find(d => d.name === debtorName);
            if (!debtor) return;

            const totalOldAmount = debtor.totalAmount;
            const totalDifference = parseFloat(newTotalAmount) - totalOldAmount;

            if (debtor.debts.length === 0) return;

            const distributedDifference = totalDifference / debtor.debts.length;

            await Promise.all(debtor.debts.map(async (debt) => {
                const updatedAmount = debt.amount + distributedDifference;
                const debtRef = doc(db, 'debts', debt.id);
                await updateDoc(debtRef, { amount: updatedAmount });
            }));

            const updatedDebtors = debtors.map(d => 
                d.name === debtorName 
                ? { ...d, totalAmount: parseFloat(newTotalAmount) } 
                : d
            );

            setDebtors(updatedDebtors);
            setEditingDebtor(null);
            setEditedTotalAmount('');
        } catch (error) {
            console.error("Error al actualizar el total de la deuda: ", error);
        }
    };

    const handleDeleteDebtor = async (debtorName) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar todas las deudas de este deudor?");
        if (confirmDelete) {
            try {
                const debtor = debtors.find(d => d.name === debtorName);
                if (debtor) {
                    await Promise.all(debtor.debts.map(debt => deleteDoc(doc(db, 'debts', debt.id))));
                    setDebtors(debtors.filter(d => d.name !== debtorName));
                    setEditingDebtor(null);  // Cerrar el modal tras eliminar
                }
            } catch (error) {
                console.error("Error al eliminar el deudor: ", error);
            }
        }
    };

    const handleDeleteDebt = async (debtId, debtorName) => {
        try {
            await deleteDoc(doc(db, 'debts', debtId));

            const updatedDebtors = debtors.map(d => {
                if (d.name === debtorName) {
                    const updatedDebts = d.debts.filter(debt => debt.id !== debtId);
                    const updatedTotalAmount = updatedDebts.reduce((total, debt) => total + debt.amount, 0);
                    return { ...d, debts: updatedDebts, totalAmount: updatedTotalAmount };
                }
                return d;
            });

            setDebtors(updatedDebtors);
        } catch (error) {
            console.error("Error al eliminar la deuda: ", error);
        }
    };

    const toggleDetails = (name) => {
        setExpandedDebtor(expandedDebtor === name ? null : name);
    };

    const startEditingTotalAmount = (debtor) => {
        setEditingDebtor(debtor.name);
        setEditedTotalAmount(debtor.totalAmount);
    };

    return (
        <div className="debtors-list">
            <div className="separador">
                DEUDAS
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
                    {debtors.map(debtor => (
                        <React.Fragment key={debtor.name}>
                            <tr>
                                <td>{debtor.name}</td>
                                <td>${debtor.totalAmount.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => toggleDetails(debtor.name)} className="save-button">
                                        {expandedDebtor === debtor.name ? 'Ocultar Detalles' : 'Ver Detalles'}
                                    </button>
                                    <button onClick={() => startEditingTotalAmount(debtor)} className="save-button">Editar Total</button>
                                </td>
                            </tr>
                            {expandedDebtor === debtor.name && (
                                <tr>
                                    <td colSpan="3">
                                        <ul>
                                            {debtor.debts.map((debt, index) => (
                                                <li key={index}>
                                                    <div>Fecha y Hora: {new Date(debt.timestamp.seconds * 1000).toLocaleString()}</div>
                                                    <div>Monto: ${debt.amount.toFixed(2)}</div>
                                                    <div>Productos:
                                                        <ul>
                                                            {debt.products.map((product, idx) => (
                                                                <li key={idx}>
                                                                    {product.name} - ${parseFloat(product.price).toFixed(2)} x {product.quantity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <button onClick={() => handleDeleteDebt(debt.id, debtor.name)} className="delete-button">Eliminar Deuda</button>
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
                    <button onClick={() => handleUpdateTotalAmount(editingDebtor, editedTotalAmount)} className="save-button">Guardar</button>
                    <button onClick={() => setEditingDebtor(null)} className="cancel-button">Cancelar</button>
                    <button onClick={() => handleDeleteDebtor(editingDebtor)} className="cancel-button">Eliminar Deudor</button>
                </div>
            )}
        </div>
    );
};

export default DebtorsList;
