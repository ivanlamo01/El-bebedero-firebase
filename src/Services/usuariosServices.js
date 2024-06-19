import firebase from "../config/firebase"

export async function getByUserId(userId){
    return await firebase.firestore().collection(`Usuarios`)
    .where("userId","==",userId)
    .get()
}