import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const db = getFirestore();

const AdditionsTable = () => {
  const [additions, setAdditions] = useState([]);

  useEffect(() => {
    const loadAdditions = async () => {
      const q = query(collection(db, 'Productos'), orderBy('dateAdded', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const additionsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          dateAdded: data.dateAdded.toDate(), // Convertir el Timestamp de Firestore a una fecha de JavaScript
        };
      });
      setAdditions(additionsList);
    };

    loadAdditions();
  }, []);

  return (
    <div>
      <h5>Últimas adiciones</h5>
      <table className="tableCar">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Fecha de Adición</th>
          </tr>
        </thead>
        <tbody>
          {additions.map((addition, index) => (
            <tr key={index}>
              <td>{addition.title}</td>
              <td>{addition.dateAdded.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdditionsTable;
