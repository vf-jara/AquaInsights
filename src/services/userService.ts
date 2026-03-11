import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    nome: string;
    email: string;
    dataCadastro: Date;
}

export const userService = {
    async createUserProfile(uid: string, nome: string, email: string) {
        try {
            const userRef = doc(db, 'usuarios', uid);
            await setDoc(userRef, {
                nome,
                email,
                dataCadastro: new Date()
            });
        } catch (error) {
            console.error("Erro ao criar perfil de usuário:", error);
            throw error;
        }
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        try {
            const userRef = doc(db, 'usuarios', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                return {
                    uid,
                    nome: data.nome,
                    email: data.email,
                    dataCadastro: data.dataCadastro?.toDate() || new Date()
                };
            }
            return null;
        } catch (error) {
            console.error("Erro ao buscar perfil de usuário:", error);
            throw error;
        }
    },

    async updateUserProfile(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'email' | 'dataCadastro'>>) {
        try {
            const userRef = doc(db, 'usuarios', uid);
            await setDoc(userRef, data, { merge: true });
        } catch (error) {
            console.error("Erro ao atualizar perfil de usuário:", error);
            throw error;
        }
    }
};
