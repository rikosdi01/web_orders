import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { db } from "../firebase";

export default class OrdersRepository {
    static getOrders(callback) {
        try {
            // Query Firestore untuk mengurutkan berdasarkan 'name'
            const ordersQuery = query(collection(db, "Orders"), orderBy("createdAt"));

            return onSnapshot(ordersQuery, (querySnapshot) => {
                const orders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(orders);
            });
        } catch (error) {
            console.error("Error listening to orders: ", error);
        }
    }

    static async getOrderById(orderId) {
        try {
            const docRef = doc(db, "Orders", orderId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return { id: docSnapshot.id, ...docSnapshot.data() };
            } else {
                console.log("Order not found!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching order: ", error);
            throw error;
        }
    }

    static async createOrder(order) {
        try {
            const docRef = await addDoc(collection(db, "Orders"), order);
            await updateDoc(doc(db, "Orders", docRef.id), { id: docRef.id });
            return docRef.id;
        } catch (error) {
            console.error("Error creating order: ", error);
            throw error;
        }
    }

    static async updateOrder(orderId, updatedOrder) {
        try {
            const docRef = doc(db, "Orders", orderId);
            await updateDoc(docRef, updatedOrder);
        } catch (error) {
            console.error("Error updating order: ", error);
            throw error;
        }
    }

    static async deleteOrder(orderId) {
        try {
            const docRef = doc(db, "Orders", orderId);
            await deleteDoc(docRef);  // Delete the document from Firestore
        } catch (error) {
            console.error("Error deleting order: ", error);
            throw error;
        }
    }
}