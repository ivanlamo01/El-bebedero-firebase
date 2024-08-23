import React, { useState } from 'react';
import { getProductByBarcode, createPromotion } from '../Services/productosServices'; // Funciones de servicio para obtener productos y crear promociones

const style ={
  container: {
    maxWidth: "370px",
    marginTop: "50px",
    marginBottom: "50px",
    borderRadius: "30px",
    backgroundColor: "rgba(33, 33, 33, 255)",
    boxShadow: "0 4px 8px black",
    padding: "20px",
    color: "white"
  },
  text:{
    color:"#FFAE00"
  }
}
function CrearPromocion() {
  const [promotionTitle, setPromotionTitle] = useState('');
  const [promotionBarcode, setPromotionBarcode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [productsInPromotion, setProductsInPromotion] = useState([]);
  const [promotionPrice, setPromotionPrice] = useState('');
  const [error, setError] = useState('');

  const addProductToPromotion = async () => {
    try {
      const product = await getProductByBarcode(barcode);
      if (product) {
        setProductsInPromotion([...productsInPromotion, product]);
        setBarcode(''); // Limpiar el campo de código de barras
      } else {
        setError('Producto no encontrado.');
      }
    } catch (error) {
      setError('Error al agregar producto.');
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!promotionTitle || !promotionPrice || productsInPromotion.length === 0) {
      setError('Por favor, complete todos los campos.');
      return;
    }
  
    try {
      // Obtener los datos completos de cada producto en la promoción para calcular el stock mínimo
      const productDataList = await Promise.all(
        productsInPromotion.map(async (product) => {
          const productData = await getProductByBarcode(product.data.Barcode);
          if (productData && productData.data && productData.data.stock !== undefined) {
            return productData.data.stock;
          } else {
            throw new Error(`Producto no encontrado o sin stock definido: ${product.data.title}`);
          }
        })
      );
  
      // Calcular el stock mínimo entre los productos de la promoción
      const promotionStock = Math.min(...productDataList);
  
      const newPromotion = {
        title: promotionTitle,
        price: promotionPrice,
        Barcode: promotionBarcode,
        stock: promotionStock,
        products: productsInPromotion.map(product => ({
          id: product.id,
          quantity: product.quantity || 1, // Asumir cantidad 1 si no se especifica
        })),
      };
  
      await createPromotion(newPromotion);
      setPromotionTitle('');
      setProductsInPromotion([]);
      setPromotionPrice('');
      setError('');
      alert('Promoción creada con éxito');
    } catch (error) {
      setError('Error al crear la promoción.');
      console.error(error);
    }
  };
  
  
  return (
    <div style={style.container}>
      <h2 style={style.text}>Crear Promoción</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título de la Promoción:</label>
          <input
            type="text"
            value={promotionTitle}
            onChange={(e) => setPromotionTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Codigo de la Promoción:</label>
          <input
            type="number"
            value={promotionBarcode}
            onChange={(e) => setPromotionBarcode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Código de Barras del Producto:</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <button type="button" className='save-button' onClick={addProductToPromotion}>Agregar Producto</button>
        </div>
        <div>
          <label>Precio de la Promoción:</label>
          <input
            type="number"
            value={promotionPrice}
            onChange={(e) => setPromotionPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Productos en la Promoción:</h3>
          <ul>
            {productsInPromotion.map(product => (
              <li key={product.id}>{product.data.title}</li>
            ))}
          </ul>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className='save-button'>Crear Promoción</button>
      </form>
    </div>
  );
}

export default CrearPromocion;
