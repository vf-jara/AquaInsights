import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore';

export interface Lote {
    id?: string;
    numeroLote: string;
    especieId: string;
    userId: string;
    dataCriacao: Date;
}

export const lotesService = {
    async createLote(loteData: Omit<Lote, 'id' | 'dataCriacao'>) {
        try {
            const docRef = await addDoc(collection(db, 'lotes'), {
                ...loteData,
                dataCriacao: Timestamp.now()
            });
            return docRef.id;
        } catch (e) {
            console.error("Erro ao criar lote: ", e);
            throw e;
        }
    },

    async getLotesByUser(userId: string): Promise<Lote[]> {
        try {
            const q = query(
                collection(db, 'lotes'),
                where("userId", "==", userId),
                orderBy("dataCriacao", "desc")
            );
            const querySnapshot = await getDocs(q);

            const lotes: Lote[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                lotes.push({
                    id: doc.id,
                    numeroLote: data.numeroLote,
                    especieId: data.especieId,
                    userId: data.userId,
                    dataCriacao: data.dataCriacao?.toDate() || new Date(),
                });
            });
            return lotes;
        } catch (e) {
            console.error("Erro ao buscar lotes: ", e);
            throw e;
        }
    }
};
