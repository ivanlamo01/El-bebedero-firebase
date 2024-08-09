import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import '../styles/debtorList.css';

const db = getFirestore();

const DebtorsList = () => {
    const [debtors, setDebtors] = useState([]);
    const [editingDebtor, setEditingDebtor] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedAmount, setEditedAmount] = useState('');
    const [expandedDebtor, setExpandedDebtor] = useState(null);

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

    const handleUpdate = async () => {
        if (editingDebtor) {
            try {
                const debtorRef = doc(db, 'debts', editingDebtor.id);
                await updateDoc(debtorRef, {
                    name: editedName,
                    amount: parseFloat(editedAmount)
                });
                const updatedDebtors = debtors.map(debtor => debtor.name === editingDebtor.name ? { ...debtor, name: editedName, totalAmount: parseFloat(editedAmount) } : debtor);
                setDebtors(updatedDebtors);
                setEditingDebtor(null);
                setEditedName('');
                setEditedAmount('');
            } catch (error) {
                console.error("Error al actualizar el deudor: ", error);
            }
        }
    };


    const handleDelete = async (debtorName, debtId = null) => {
        try {
            if (debtId) {
                // Eliminar una deuda específica
                await deleteDoc(doc(db, 'debts', debtId));
                const updatedDebtors = debtors.map(debtor => {
                    if (debtor.name === debtorName) {
                        return {
                            ...debtor,
                            debts: debtor.debts.filter(debt => debt.id !== debtId),
                            totalAmount: debtor.totalAmount - debtor.debts.find(debt => debt.id === debtId).amount
                        };
                    }
                    return debtor;
                }).filter(debtor => debtor.debts.length > 0); // Filtrar deudores sin deudas
                setDebtors(updatedDebtors);
            } else {
                // Eliminar todas las deudas del deudor
                const debtor = debtors.find(d => d.name === debtorName);
                if (debtor) {
                    await Promise.all(debtor.debts.map(debt => deleteDoc(doc(db, 'debts', debt.id))));
                    setDebtors(debtors.filter(d => d.name !== debtorName));
                }
            }
        } catch (error) {
            console.error("Error al eliminar el deudor: ", error);
        }
    };

    const toggleDetails = (name) => {
        setExpandedDebtor(expandedDebtor === name ? null : name);
    };

    return (
        <>
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
                                        <button onClick={() => toggleDetails(debtor.name)} className="edit-button">
                                            {expandedDebtor === debtor.name ? 'Ocultar Detalles' : 'Ver Detalles'}
                                        </button>
                                        <button onClick={() => handleDelete(debtor.name)} className="delete-button">Eliminar Deudor</button>
                                    </td>
                                </tr>
                                {expandedDebtor === debtor.name && (
                                    <tr>
                                        <td colSpan="3">
                                            <ul>
                                                {debtor.debts.map((debt, index) => (
                                                    <li key={index}>
                                                        <div>Fecha y Hora: {new Date(debt.timestamp.seconds * 1000).toLocaleString()}</div>
                                                        <div>Productos:
                                                            <ul>
                                                                {debt.products.map((product, idx) => (
                                                                    <li key={idx}>
                                                                        {product.name} - ${parseFloat(product.price).toFixed(2)} x {product.quantity}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <button onClick={() => handleDelete(debtor.name, debt.id)} className="delete-button">Eliminar Deuda</button>
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
                        <h2>Editar Deudor</h2>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Nombre"
                        />
                        <input
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(e.target.value)}
                            placeholder="Monto"
                        />
                        <button onClick={handleUpdate} className="save-button">Guardar</button>
                        <button onClick={() => setEditingDebtor(null)} className="cancel-button">Cancelar</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default DebtorsList;
