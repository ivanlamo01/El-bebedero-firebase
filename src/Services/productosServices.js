import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc,getDoc } from "firebase/firestore";
import firebase from "../config/firebase";

const db = getFirestore();

export const getAll = async (searchTerm = "", category = "", barcode = "") => {
    const productsCollection = collection(db, "Productos");
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    const lowerCaseCategory = category.toLowerCase().trim();
    const conditions = [];
    
    if (lowerCaseSearchTerm) {
        conditions.push(
            where("title_normalized", ">=", lowerCaseSearchTerm),
            where("title_normalized", "<=", lowerCaseSearchTerm + '\uf8ff')
        );
    }
    if (lowerCaseCategory) {
        conditions.push(
            where("category_normalized", ">=", lowerCaseCategory),
            where("category_normalized", "<=", lowerCaseCategory + '\uf8ff')
        );
    }
    if (barcode) {
        conditions.push(
            where("Barcode", ">=", barcode),
            where("Barcode", "<=", barcode + '\uf8ff')
        );
    }

    const q = query(productsCollection, ...conditions);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
};

export async function getCarousel() {
    const querySnapshot = await firebase.firestore().collection("CarouselImg").get();
    return querySnapshot.docs;
}

export async function getById(id) {
    return await firebase.firestore().doc(`Productos/${id}`).get();
}

export async function create(data) {
    const titleNormalized = data.title.toLowerCase().replace(/\s+/g, '');
    const categoryNormalized = data.category.toLowerCase().replace(/\s+/g, '');
    const dateOfAddition = data.dateAdded;

    const dataWithNormalizedFields = {
        ...data,
        title_normalized: titleNormalized,
        category_normalized: categoryNormalized,
        dateAdded: dateOfAddition,
    };

    try {
        return await firebase.firestore().collection("Productos").add(dataWithNormalizedFields);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

export async function update(id, data) {
    const titleNormalized = data.title ? data.title.toLowerCase().replace(/\s+/g, '') : undefined;
    const categoryNormalized = data.category ? data.category.toLowerCase().replace(/\s+/g, '') : undefined;

    const dataWithNormalizedFields = {
        ...data,
        title_normalized: titleNormalized,
        category_normalized: categoryNormalized,
    };

    try {
        return await firebase.firestore().doc(`Productos/${id}`).set(dataWithNormalizedFields, { merge: true });
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

export async function remove(id) {
    return await firebase.firestore().doc(`Productos/${id}`).delete();
}

export const getProductByBarcode = async (barcode) => {
    try {
        const productsCollection = collection(db, "Productos");
        const promoRef = collection(db, 'promociones');
        const q = query(productsCollection, where("Barcode", "==", barcode));
        const promoQuery = query(promoRef, where('Barcode', '==', barcode));
        const querySnapshot = await getDocs(q);
        const promoSnapshot = await getDocs(promoQuery);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, data: doc.data(), type: 'product' };
        } else if (!promoSnapshot.empty) {
            const doc = promoSnapshot.docs[0];
            return { id: doc.id, data: doc.data(), type: 'promotion' };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        throw error; // Re-lanzar el error para ser manejado por el componente
    }
};
export const createPromotion = async (promotion) => {
    try {
        const titleNormalized = promotion.title.toLowerCase().replace(/\s+/g, '');
        const dataWithNormalizedFields = {
            ...promotion,
            title_normalized: titleNormalized,
        };

        // Referencia al documento en la colección "promociones"
        const promotionRef = firebase.firestore().collection('promociones').doc();
        await promotionRef.set(dataWithNormalizedFields);

        // Referencia al documento en la colección "Productos"
        const productRef = firebase.firestore().collection('Productos').doc();
        await productRef.set(dataWithNormalizedFields);
    } catch (error) {
        console.error('Error al crear la promoción:', error);
        throw error;
    }
};


export const getProductByTitle = async (title) => {
try{
    const productsCollection = collection(db, "Productos");
    const titleNormalized = title.toLowerCase().replace(/\s+/g, '');
    const promoRef = collection(db, 'promociones');
    const promoQuery = query(promoRef, where('title', '==', title));
    const q = query(
        productsCollection,
        where("title_normalized", ">=", titleNormalized),
        where("title_normalized", "<=", titleNormalized + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    const promoSnapshot = await getDocs(promoQuery);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, data: doc.data(), type: 'product' };
    }else if (!promoSnapshot.empty) {
        const doc = promoSnapshot.docs[0];
        return { id: doc.id, data: doc.data(), type: 'promotion' };
    } 
    else {
        return null;
    }
}catch(error){
    console.error('Error al buscar el producto:', error);
        throw error; // Re-lanzar el error para ser manejado por el componente
}
};

export const updateProductStock = async (id, newStock) => {
    const productRef = doc(db, "Productos", id);
    await updateDoc(productRef, { stock: newStock });
};

export const addSale = async (sale) => {
    try {
        const docRef = await addDoc(collection(db, 'sales'), sale);
        console.log('Venta agregada con ID: ', docRef.id);
    } catch (e) {
        console.error('Error agregando la venta: ', e);
    }
};

export const fetchSalesData = async () => {
    const salesCollection = collection(db, 'sales');
    const querySnapshot = await getDocs(salesCollection);

    return querySnapshot.docs.map(doc => {
        const timestamp = doc.data().timestamp;
        const saleDate = timestamp ? new Date(timestamp.seconds * 1000) : null;
        
        if (saleDate) {
            saleDate.setHours(0, 0, 0, 0);  // Asegurarse de que la hora no cause desplazamiento de días
        }

        const totalStr = String(doc.data().total);
        return {
            date: saleDate ? saleDate.toISOString().split('T')[0] : null,
            total: Number(totalStr.replace(/[^0-9.-]+/g, "")) || 0,
        };
    }).filter(sale => sale.date !== null);
};

export const fetchExpensesData = async () => {
    const expensesCollection = collection(db, 'expenses');
    const querySnapshot = await getDocs(expensesCollection);
    return querySnapshot.docs.map(doc => ({
        date: new Date(doc.data().date).toISOString().split('T')[0],
        total: parseFloat(doc.data().amount) || 0,
    })).filter(expense => expense.date !== null);
};

export const sellPromotion = async (promotionId, quantitySold) => {
    try {
        // Obtener la promoción desde la base de datos
        const promotionRef = firebase.firestore().collection('promociones').doc(promotionId);
        const promotionDoc = await promotionRef.get();
        if (!promotionDoc.exists) {
            throw new Error('La promoción no existe');
        }
        const promotionData = promotionDoc.data();
        // Recorrer los productos en la promoción para restar stock
        for (const product of promotionData.products) {
            const productRef = doc(db, "Productos", product.id);
            const productDoc = await getDoc(productRef);
            if (!productDoc.exists()) {
                throw new Error(`El producto con ID ${product.id} no existe`);
            }
            const productData = productDoc.data();
            const newStock = productData.stock - (product.quantity * quantitySold);
            // Asegurarse de que el stock no sea negativo
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto ${productData.title}`);
            }
            // Actualizar el stock del producto utilizando la función `updateProductStock`
            await updateProductStock(product.id, newStock);
        }
        // Opcional: Registrar la venta de la promoción
    } catch (error) {
        console.error('Error al realizar la venta de la promoción:', error);
        throw error;
    }
};

