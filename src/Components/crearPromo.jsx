import React, { useState } from 'react';
import {
  getProductByBarcode,
  createPromotion,
  update
} from '../Services/productosServices'; // Asegúrate de tener una función updateProduct en tus servicios

const style = {
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
  text: {
    color: "#FFAE00"
  },
  error: {
    color: 'red',
    marginTop: '10px'
  },
  success: {
    color: 'green',
    marginTop: '10px'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#FFFFFF'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#FFAE00',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
    marginTop: '10px'
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px'
  },
  productItem: {
    backgroundColor: '#444',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    color: '#fff',
    cursor: 'pointer'
  }
};

function CrearPromocion() {
  const [promotionTitle, setPromotionTitle] = useState('');
  const [promotionBarcode, setPromotionBarcode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [productsInPromotion, setProductsInPromotion] = useState([]);
  const [promotionPrice, setPromotionPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const addProductToPromotion = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const product = await getProductByBarcode(barcode);
      if (product) {
        // Actualizar el campo isPromo del producto

        setProductsInPromotion(prevProducts => {
          // Verificar si el producto ya está en la promoción
          if (prevProducts.some(p => p.id === product.id)) {
            setError('El producto ya está agregado a la promoción.');
            return prevProducts;
          }
          return [...prevProducts, { ...product, isPromo: true }];
        });
        setBarcode('');
        setSuccess('Producto agregado a la promoción correctamente.')
        await update(product.id, { isPromo: true });;
      } else {
        setError('Producto no encontrado.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al agregar el producto a la promoción.');
    } finally {
      setLoading(false);
    }
  };
  

  const removeProductFromPromotion = async (productId) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Actualizar el campo isPromo del producto a false
      await update(productId, { isPromo: false });
      setProductsInPromotion(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      setSuccess('Producto removido de la promoción correctamente.');
    } catch (err) {
      console.error(err);
      setError('Error al remover el producto de la promoción.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    if (!promotionTitle || !promotionPrice || !promotionBarcode) {
      setError('Por favor, complete todos los campos requeridos.');
      setLoading(false);
      return;
    }
  
    if (productsInPromotion.length === 0) {
      setError('Agregue al menos un producto a la promoción.');
      setLoading(false);
      return;
    }
  
    try {
      const promotionStock = Math.min(
        ...productsInPromotion.map(product => product.data.stock || 0)
      );
  
      const newPromotion = {
        title: promotionTitle,
        price: parseFloat(promotionPrice),
        Barcode: promotionBarcode,
        stock: promotionStock,
        category: 'promo', // Aquí se asigna la categoría "promo"
        products: productsInPromotion.map(product => ({
          id: product.id,
          quantity: 1, // Puedes ajustar la cantidad según tus necesidades
          isPromo: true
        })),
        isPromo: true
      };
  
      await createPromotion(newPromotion);
  
      setPromotionTitle('');
      setPromotionBarcode('');
      setProductsInPromotion([]);
      setPromotionPrice('');
      setSuccess('Promoción creada con éxito.');
    } catch (err) {
      console.error(err);
      setError('Error al crear la promoción.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={style.container}>
      <h2 style={style.text}>Crear Promoción</h2>
      <form onSubmit={handleSubmit}>
        <div style={style.inputGroup}>
          <label >Título de la Promoción:</label>
          <input
            type="text"
            value={promotionTitle}
            onChange={(e) => setPromotionTitle(e.target.value)}
            required
            disabled={loading}
            className="input"
          />
        </div>
        <div style={style.inputGroup}>
          <label style={style.label}>Código de la Promoción:</label>
          <input
            type="number"
            value={promotionBarcode}
            onChange={(e) => setPromotionBarcode(e.target.value)}
            required
            className="input"
            disabled={loading}
          />
        </div>
        <div style={style.inputGroup}>
          <label style={style.label}>Código de Barras del Producto:</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="input"
            disabled={loading}
          />
          <button
            type="button"
            className='save-button'
            onClick={addProductToPromotion}
            disabled={loading || !barcode}
          >
            {loading ? 'Agregando...' : 'Agregar Producto'}
          </button>
        </div>
        <div style={style.inputGroup}>
          <label style={style.label}>Precio de la Promoción:</label>
          <input
            type="number"
            value={promotionPrice}
            onChange={(e) => setPromotionPrice(e.target.value)}
            required
            className="input"
            disabled={loading}
          />
        </div>
        <div>
          <h3 style={style.text}>Productos en la Promoción:</h3>
          <ul style={style.productList}>
            {productsInPromotion.map(product => (
              <li key={product.id} style={style.productItem}>
                {product.data.title}
                <button
                  type="button"
                  className='delete-button'
                  onClick={() => removeProductFromPromotion(product.id)}
                  disabled={loading}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>
        {error && <p style={style.error}>{error}</p>}
        {success && <p style={style.success}>{success}</p>}
        <button
          type="submit"
          className='save-button'
          disabled={loading || productsInPromotion.length === 0}
        >
          {loading ? 'Creando Promoción...' : 'Crear Promoción'}
        </button>
      </form>
    </div>
  );
}

export default CrearPromocion;
