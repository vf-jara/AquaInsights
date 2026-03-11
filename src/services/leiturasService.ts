import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { avaliarLeitura } from '../utils/waterQualityRules';

export interface Leitura {
    id?: string;
    loteId: string;
    data: Date;
    ph: number;
    oxigenio: number;
    temperatura: number;
    amonia: number;
    nitrito: number;
    nitrato: number;
    alcalinidade: number;
    status: string;
}

export const leiturasService = {
    async registerLeitura(leituraData: Omit<Leitura, 'id' | 'data' | 'status'>) {
        try {
            const avaliacao = avaliarLeitura({
                temperatura: leituraData.temperatura,
                oxigenio: leituraData.oxigenio,
                ph: leituraData.ph,
                amonia: leituraData.amonia,
                nitrito: leituraData.nitrito,
                nitrato: leituraData.nitrato,
                alcalinidade: leituraData.alcalinidade,
            });

            const status = avaliacao.nivelGeral === 'Ótimo'
                ? 'Normal'
                : avaliacao.nivelGeral === 'Atenção'
                    ? 'Alerta'
                    : 'Perigo';

            const docRef = await addDoc(collection(db, 'leituras'), {
                ...leituraData,
                status,
                data: Timestamp.now()
            });
            return { id: docRef.id, avaliacao };
        } catch (e) {
            console.error("Erro ao registrar leitura: ", e);
            throw e;
        }
    },

    async getLeiturasByLote(loteId: string): Promise<Leitura[]> {
        try {
            const q = query(
                collection(db, 'leituras'),
                where("loteId", "==", loteId),
                orderBy("data", "desc")
            );
            const querySnapshot = await getDocs(q);

            const leituras: Leitura[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                leituras.push({
                    id: doc.id,
                    loteId: data.loteId,
                    ph: data.ph,
                    oxigenio: data.oxigenio,
                    temperatura: data.temperatura,
                    amonia: data.amonia,
                    nitrito: data.nitrito,
                    nitrato: data.nitrato,
                    alcalinidade: data.alcalinidade ?? data.dureza ?? 0,
                    status: data.status,
                    data: data.data?.toDate() || new Date(),
                });
            });
            return leituras;
        } catch (e) {
            console.error("Erro ao buscar leituras: ", e);
            throw e;
        }
    }
};
