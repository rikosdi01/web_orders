import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default class UserRepository {
    static getUsers(callback) {
        try {
            const usersQuery = query(collection(db, "Users"), orderBy("name"));
    
            return onSnapshot(usersQuery, (querySnapshot) => {
                const users = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(users);
            }, (error) => {
                console.error("Error listening to Users: ", error);
            });
    
        } catch (error) {
            console.error("Error initializing chat listener: ", error);
        }
    }

    static async getUserById(userId) {
        try {
            const docRef = doc(db, "Users", userId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return { id: docSnapshot.id, ...docSnapshot.data() };
            } else {
                console.log("User not found!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
            throw error;
        }
    }
}