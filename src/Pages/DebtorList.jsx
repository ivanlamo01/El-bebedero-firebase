import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore'; // Importar funciones de Firebase
import '../styles/debtorList.css';

const db = getFirestore();

const DebtorsList = () => {
    const [debtors, setDebtors] = useState([]);
    const [editingDebtor, setEditingDebtor] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedAmount, setEditedAmount] = useState('');

    useEffect(() => {
        const fetchDebtors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'debts')); // Asegúrate de usar el nombre correcto de la colección
                const debtorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDebtors(debtorsList);
            } catch (error) {
                console.error("Error al obtener los deudores: ", error);
            }
        };

        fetchDebtors();
    }, []);

    const handleEdit = (debtor) => {
        setEditingDebtor(debtor);
        setEditedName(debtor.name);
        setEditedAmount(debtor.amount);
    };

    const handleUpdate = async () => {
        if (editingDebtor) {
            try {
                const debtorRef = doc(db, 'debts', editingDebtor.id);
                await updateDoc(debtorRef, {
                    name: editedName,
                    amount: parseFloat(editedAmount)
                });
                const updatedDebtors = debtors.map(debtor => debtor.id === editingDebtor.id ? { ...debtor, name: editedName, amount: parseFloat(editedAmount) } : debtor);
                setDebtors(updatedDebtors);
                setEditingDebtor(null);
                setEditedName('');
                setEditedAmount('');
            } catch (error) {
                console.error("Error al actualizar el deudor: ", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'debts', id));
            const updatedDebtors = debtors.filter(debtor => debtor.id !== id);
            setDebtors(updatedDebtors);
        } catch (error) {
            console.error("Error al eliminar el deudor: ", error);
        }
    };

    return (
        <>
            <div className="separador">
                <h1>Lista de Deudores</h1>
            </div>
            <div className="debtors-list">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Total</th>
                        <th>Detalles</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {debtors.map(debtor => (
                        <tr key={debtor.id}>
                            <td>{debtor.name}</td>
                            <td>${debtor.amount.toFixed(2)}</td>
                            <td>
                                <details>
                                    <summary>Ver Detalles</summary>
                                    <ul>
                                        <li>Fecha y Hora: {new Date(debtor.timestamp.seconds * 1000).toLocaleString()}</li>
                                        <li>Productos:
                                            <ul>
                                                {debtor.products && debtor.products.map((product, index) => (
                                                    <li key={index}>
                                                        {product.name} - ${parseFloat(product.price).toFixed(2)} x {product.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </details>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(debtor)} className="edit-button">Editar</button>
                                <button onClick={() => handleDelete(debtor.id)} className="delete-button">Eliminar</button>
                            </td>
                        </tr>
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
        </>);
};

export default DebtorsList;