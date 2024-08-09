import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
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
    const productsCollection = collection(db, "Productos");
    const q = query(productsCollection, where("Barcode", "==", barcode));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, data: doc.data() };
    } else {
        return null;
    }
};

export const getProductByTitle = async (title) => {
    const titleNormalized = title.toLowerCase().replace(/\s+/g, '');
    const productsCollection = collection(db, "Productos");
    const q = query(
        productsCollection,
        where("title_normalized", ">=", titleNormalized),
        where("title_normalized", "<=", titleNormalized + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, data: doc.data() };
    } else {
        return null;
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
    return querySnapshot.docs.map(doc => ({
        date: doc.data().timestamp ? new Date(doc.data().timestamp.seconds * 1000).toISOString().split('T')[0] : null,
        total: Number(doc.data().total) || 0,
    })).filter(sale => sale.date !== null);
};

export const fetchExpensesData = async () => {
    const expensesCollection = collection(db, 'expenses');
    const querySnapshot = await getDocs(expensesCollection);
    return querySnapshot.docs.map(doc => ({
        date: new Date(doc.data().date).toISOString().split('T')[0],
        total: parseFloat(doc.data().amount) || 0,
    })).filter(expense => expense.date !== null);
};
