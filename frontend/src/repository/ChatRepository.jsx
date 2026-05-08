import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

// export default class ChatRepository {
//     static chatRoom (callback, uid) {
//         try {
//             const chatQuery = query(collection(db, "Chats"), where("participants", contain, uid))
//             const messageQuery = query(collection(db, `Chats\messages`, orderBy(createdAt)));

//             return onSnapshot(messageQuery, (querySnapshot) => {
//                 const chats = querySnapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));

//                 callback(chats);
//             });
//         } catch (error) {
//             console.error("Error listening to chat", error);
//         }
//     }
// }

export default class ChatRepository {
    static getChats(callback, uid) {
        try {
            const chatsQuery = query(
                collection(db, "Chats"),
                where("participants", "array-contains", uid),
                orderBy("lastUpdated", "desc")
            );

            return onSnapshot(chatsQuery, (querySnapshot) => {
                const chats = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(chats);
            }, (error) => {
                console.error("Error listening to Chats: ", error);
            });

        } catch (error) {
            console.error("Error initializing chat listener: ", error);
        }
    }

    static async createRoom(room) {
        try {
            const docRef = await addDoc(collection(db, "Chats"), room);
            await updateDoc(doc(db, "Chats", docRef.id), { id: docRef.id });
            return docRef.id;
        } catch (error) {
            console.error("Error creating Room Chat: ", error);
            throw error;
        }
    }

    static async getMessages(chatId, lastVisible = null) {
        try {
            let messagesQuery = query(
                collection(db, `Chats/${chatId}/Messages`),
                orderBy("createdAt", "asc"),
                limit(20) // ✅ Ambil 20 pesan untuk paginasi
            );

            if (lastVisible) {
                messagesQuery = query(messagesQuery, startAfter(lastVisible)); // ✅ Paginasi, lanjut dari pesan terakhir
            }

            const querySnapshot = await getDocs(messagesQuery);
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            return { messages, lastVisible: newLastVisible };
        } catch (error) {
            console.error("Error fetching messages: ", error);
            return { messages: [], lastVisible: null };
        }
    }

    static listenForNewMessages(chatId, callback) {
        const messagesQuery = query(
            collection(db, `Chats/${chatId}/Messages`),
            orderBy("createdAt", "desc"), // ✅ Ambil terbaru dulu
            limit(1) // ✅ Hanya ambil 1 pesan terbaru
        );

        return onSnapshot(messagesQuery, (snapshot) => {
            const newMessages = snapshot.docChanges()
                .filter(change => change.type === "added")
                .map(change => ({
                    id: change.doc.id,
                    ...change.doc.data(),
                }));

            if (newMessages.length > 0) {
                callback(newMessages);
            }
        });
    }


    static async createMessage(chatId, messages) {
        try {
            await addDoc(collection(db, `Chats/${chatId}/Messages`), messages);
        } catch (error) {
            console.error("Error creating Message: ", error);
            throw error;
        }
    }    
}