import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

const InventoryTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const q = query(
        collection(db, "Productos"),
        orderBy("stock", "asc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map((doc) => doc.data());
      setProducts(productsList);
    };

    loadProducts();
  }, []);

  return (
    <div>
      <h5>Poco stock</h5>
      <table className="tableCar">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.title}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
