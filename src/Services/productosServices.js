//import axios
//import instance from "../config/axios"
import firebase from "../config/firebase"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

const db = getFirestore();

export const getAll = async (searchTerm = "", category = "", barcode = "") => {
    const productsCollection = collection(db, "Productos");

    // Normaliza los términos de búsqueda
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    const lowerCaseCategory = category.toLowerCase().trim();

    // Construye una lista de condiciones para la consulta
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

    // Construye la consulta
    const q = query(productsCollection, ...conditions);

    // Ejecuta la consulta y devuelve los resultados
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
};

export async function getCarousel(){
    const querySnapshot = await firebase
        .firestore()
        .collection("CarouselImg")
        .get();
    return (querySnapshot.docs)
}

export async function getById(id){
    return await firebase
        .firestore()
        .doc(`Productos/${id}`)
        .get()
}


export async function create(data) {
    // Normaliza el título y la categoría
    const titleNormalized = data.title.toLowerCase().replace(/\s+/g, '');
    const categoryNormalized = data.category.toLowerCase().replace(/\s+/g, '');

    // Crea un nuevo objeto con los campos normalizados
    const dataWithNormalizedFields = {
        ...data,
        title_normalized: titleNormalized,
        category_normalized: categoryNormalized
    };

    try {
        // Agrega el documento a la colección "Productos"
        return await firebase.firestore().collection("Productos").add(dataWithNormalizedFields);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

export async function update(id, data) {
    // Normaliza el título y la categoría si están presentes en los datos
    const titleNormalized = data.title ? data.title.toLowerCase().replace(/\s+/g, '') : undefined;
    const categoryNormalized = data.category ? data.category.toLowerCase().replace(/\s+/g, '') : undefined;

    // Crea un nuevo objeto con los campos normalizados
    const dataWithNormalizedFields = {
        ...data,
        title_normalized: titleNormalized,
        category_normalized: categoryNormalized
    };

    try {
        // Actualiza el documento en la colección "Productos"
        return await firebase.firestore().doc(`Productos/${id}`).set(dataWithNormalizedFields, { merge: true });
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

export async function remove(id){
    return await firebase
        .firestore()
        .doc(`Productos/${id}`)
        .delete()
}