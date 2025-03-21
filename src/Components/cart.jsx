import { useCart } from "../Context/CartContext";
import {
  getProductByBarcode,
  getProductByTitle,
  updateProductStock,
} from "../Services/productosServices";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import "../styles/cart.css";
import { Spinner } from "react-bootstrap";
import { collection, addDoc, getFirestore,getDocs } from "firebase/firestore";

const db = getFirestore();

function Cart() {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
    useCart();
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [debtorName, setDebtorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ variant: "", text: "" });
  const [paymentError, setPaymentError] = useState(false); // Nuevo estado para el error
  const inputRef = useRef(null);
  const [debtors, setDebtors] = useState([]);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "debts"));
  
        // Obtener nombres únicos de los deudores
        const debtorNames = [...new Set(querySnapshot.docs.map(doc => doc.data().name))];
  
        setDebtors(debtorNames);
      } catch (error) {
        console.error("Error al obtener deudores:", error);
      }
    };
  
    fetchDebtors();
  }, []);
  
  const handleSearchByBarcode = async (event) => {
    event.preventDefault();
    try {
      const product = await getProductByBarcode(barcode);
      if (product) {
        handleAddToCart(product);
        setBarcode("");
      } else {
        alert("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
    }
  };

  const handleSearchByTitle = async (event) => {
    event.preventDefault();
    try {
      const product = await getProductByTitle(title);
      if (product) {
        handleAddToCart(product);
        setTitle("");
      } else {
        alert("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
    }
  };

  const handleAddToCart = (product) => {
    if (product.data.category === "Almacen") {
      const enteredPrice = prompt("Ingrese el precio para este producto:");
      if (enteredPrice && !isNaN(enteredPrice)) {
        const enteredDescription = prompt(
          "Ingrese una descripción para este producto:"
        );
        addToCart(
          product,
          parseFloat(enteredPrice),
          enteredDescription || product.data.description
        );
      } else {
        alert("Por favor, ingrese un precio válido.");
      }
    } else {
      const existingProduct = cart.find((item) => item.id === product.id);
      if (existingProduct) {
        updateCartQuantity(product.id, existingProduct.quantity + 1);
      } else {
        addToCart(product);
      }
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    updateCartQuantity(id, newQuantity);
  };

  const handlePurchaseConfirmation = () => {
    setShowModal(true);
  };

  const showAlert = (variant, text) => {
    setAlert({ variant, text });
    setTimeout(() => {
      setAlert({ variant: "", text: "" });
    }, 3000); // La alerta desaparecerá después de 3 segundos
  };

  const confirmPurchase = async () => {
    if (!paymentMethod) {
      setPaymentError(true);
      return;
    }

    if (paymentMethod === "Deuda" && !debtorName) {
      showAlert("danger", "Por favor, ingrese el nombre del deudor.");
      return;
    }
    if (paymentMethod === "Efectivo") {
      const efect = prompt("¿Con cuánto abona el cliente?");
      
      if (efect === null) {
        showAlert("warning", "Operación cancelada.");
        return;
      }
    
      const efectivoIngresado = parseFloat(efect);
    
      if (isNaN(efectivoIngresado) || efectivoIngresado < total) {
        showAlert("danger", "Monto ingresado inválido o insuficiente.");
        return;
      }
    
      const change = efectivoIngresado - total;
      window.alert(`El vuelto es: $${change.toFixed(2)}`);
    }

    try {
      setLoading(true);

      for (const item of cart) {
        if (item && item.data && item.data.Barcode) {
          const productOrPromotion = await getProductByBarcode(
            item.data.Barcode
          );

          if (productOrPromotion) {
            if (productOrPromotion.data.ispromo) {
              // Si es una promoción, actualizar el stock de los productos que la componen
              const promotionProducts = productOrPromotion.data.products;
              for (const promoProduct of promotionProducts) {
                const productInPromo = await getProductByBarcode(
                  promoProduct.barcode
                );
                const newStock =
                  productInPromo.data.stock -
                  promoProduct.quantity * item.quantity;
                if (newStock >= 0) {
                  await updateProductStock(productInPromo.id, newStock);
                } else {
                  showAlert(
                    "danger",
                    `No hay suficiente stock para ${productInPromo.data.title}`
                  );
                  setLoading(false);
                  return;
                }
              }
            } else {
              // Si es un producto regular, reducir su stock normalmente
              const newStock = productOrPromotion.data.stock - item.quantity;
              if (newStock >= 0) {
                await updateProductStock(productOrPromotion.id, newStock);
              } else {
                showAlert(
                  "danger",
                  `No hay suficiente stock para ${productOrPromotion.data.title}`
                );
                setLoading(false);
                return;
              }
            }
          } else {
            console.error("Producto o promoción inválido en el carrito:", item);
          }
        }
      }

      // Guardar la venta en Firestore
      const sale = {
        total: total,
        products: cart.map((item) => ({
          title: item.data.title,
          description: item.customDescription || "",
          price: item.customPrice,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
        timestamp: new Date(),
      };
      await addDoc(collection(db, "sales"), sale);

      if (paymentMethod === "Deuda") {
        const debt = {
          name: debtorName,
          amount: total,
          timestamp: new Date(),
          products: cart.map((item) => ({
            name: item.data.title,
            description: item.customDescription || "",
            price: item.customPrice,
            quantity: item.quantity,
          })),
        };
        await addDoc(collection(db, "debts"), debt);
      }

      clearCart();
      showAlert("success", "Compra confirmada y stock actualizado");
    } catch (error) {
      console.error("Error al confirmar la compra:", error);
      showAlert(
        "danger",
        "Error al confirmar la compra. Por favor, inténtelo de nuevo."
      );
    } finally {
      setLoading(false);
      setShowModal(false);
      inputRef.current.focus();
    }
  };

  const calculateTotal = useCallback(() => {
    const total = cart.reduce(
      (acc, item) => acc + (parseFloat(item.customPrice) || 0) * item.quantity,
      0
    );
    setTotal(total);
  }, [cart]);

  useEffect(() => {
    calculateTotal();
  }, [cart, calculateTotal]);
  useEffect(() => {
    // Enfoca el input al cargar el componente
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <>
      <div className="sep"></div>
      <div className="cart-container">
        <div className="left-side">
          <h4 style={{ color: "#FFAE00" }}>Iniciar Venta</h4>
          <form onSubmit={handleSearchByBarcode} className="cart-form">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Buscar por código de barras"
              className="cart-input"
              ref={inputRef}
            />
            <button type="submit" className="save-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          <form onSubmit={handleSearchByTitle} className="cart-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Buscar por título"
              className="cart-input"
            />
            <button type="submit" className="save-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <div className="cart-table-container">
              <button onClick={clearCart} className="cancel-button-cart">
                Vaciar Carrito
              </button>
              <table className="cart-table">
                <thead className="cart-table-header">
                  <tr>
                    <th>Barcode</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Descr</th>
                    <th>Cantidad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={`${item.id}-${item.customDescription}`}>
                      <td>{item.data.Barcode}</td>
                      <td>{item.data.title}</td>
                      <td>${(parseFloat(item.customPrice) || 0).toFixed(2)}</td>
                      <td>{item.customDescription}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="quantity-input"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cancel-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="right-side">
          <div className="total">
            <h3 className="titulo">Total de la compra</h3>
            <h5>Total: ${total.toFixed(2)}</h5>
            <button
              onClick={handlePurchaseConfirmation}
              className="save-button-cart"
              disabled={cart.length === 0}
            >
              Confirmar Compra
            </button>
            {cart.length === 0 && (
              <p>No puedes confirmar la compra porque el carrito está vacío.</p>
            )}
            {alert.text && (
              <div className={`alert alert-${alert.variant}`}>{alert.text}</div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Seleccionar Medio de Pago</h2>
            <select
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentError(false); // Limpiar el error cuando se selecciona un método de pago
              }}
              value={paymentMethod}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Deuda">Deuda</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
            {paymentError && (
              <p style={{ color: "red" }}>
                Por favor, seleccione un método de pago.
              </p>
            )}
            {paymentMethod === "Deuda" && (
              <>
                <select
                  value={debtorName}
                  onChange={(e) => setDebtorName(e.target.value)}
                  className="cart-input"
                  style={{ marginTop: "10px" }}
                >
                  <option value="">Seleccionar deudor</option>
                  {debtors.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {!debtorName && (
                  <p style={{ color: "red" }}>
                    El nombre del deudor es obligatorio.
                  </p>
                )}
              </>
            )}

            <button onClick={confirmPurchase} className="save-button">
              {loading && <Spinner animation="border" size="sm" />}
              Confirmar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="cancel-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
