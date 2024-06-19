//import axios
//import instance from "../config/axios"
import firebase from "../config/firebase"

export async function getAll(){
    const querySnapshot = await firebase
        .firestore()
        .collection("Productos")
        .get();
    return (querySnapshot.docs)
}

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

export async function create(data){
    return await firebase
        .firestore()
        .collection("Productos")
        .add(data);
}

export async function update(id,data){
    return await firebase
        .firestore()
        .doc(`Productos/${id}`)
        .set(data)
}

export async function remove(id){
    return await firebase
        .firestore()
        .doc(`Productos/${id}`)
        .delete()
}