import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { avaliarLeitura } from '../utils/waterQualityRules';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
    isOffline?: boolean;
}

const OFFLINE_LEITURAS_KEY = '@AquaInsights:offline_leituras';

export const leiturasService = {
    async registerLeitura(leituraData: Omit<Leitura, 'id' | 'data' | 'status' | 'isOffline'>) {
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

            const newLeitura = {
                ...leituraData,
                status,
                data: new Date()
            };

            const networkState = await NetInfo.fetch();

            if (networkState.isConnected) {
                // Online, salvar no Firebase
                const docRef = await addDoc(collection(db, 'leituras'), {
                    ...newLeitura,
                    data: Timestamp.fromDate(newLeitura.data)
                });
                return { id: docRef.id, avaliacao };
            } else {
                // Offline, salvar no AsyncStorage
                const offlineId = `offline_${Date.now()}`;
                const offlineLeitura: Leitura = { ...newLeitura, id: offlineId, isOffline: true };
                
                const existingOffline = await AsyncStorage.getItem(OFFLINE_LEITURAS_KEY);
                let offlineList: Leitura[] = existingOffline ? JSON.parse(existingOffline) : [];
                
                offlineList.push(offlineLeitura);
                await AsyncStorage.setItem(OFFLINE_LEITURAS_KEY, JSON.stringify(offlineList));
                
                return { id: offlineId, avaliacao };
            }
        } catch (e) {
            console.error("Erro ao registrar leitura: ", e);
            throw e;
        }
    },

    async syncOfflineLeituras() {
        try {
            const existingOffline = await AsyncStorage.getItem(OFFLINE_LEITURAS_KEY);
            if (!existingOffline) return 0;

            const networkState = await NetInfo.fetch();
            if (!networkState.isConnected) return 0;

            const offlineList: Leitura[] = JSON.parse(existingOffline);
            if (offlineList.length === 0) return 0;

            const leiturasQueFalharam: Leitura[] = [];

            for (const leitura of offlineList) {
                try {
                    const dataFormatada = new Date(leitura.data);
                    await addDoc(collection(db, 'leituras'), {
                        loteId: leitura.loteId,
                        ph: leitura.ph,
                        oxigenio: leitura.oxigenio,
                        temperatura: leitura.temperatura,
                        amonia: leitura.amonia,
                        nitrito: leitura.nitrito,
                        nitrato: leitura.nitrato,
                        alcalinidade: leitura.alcalinidade,
                        status: leitura.status,
                        data: Timestamp.fromDate(dataFormatada)
                    });
                } catch (err) {
                    console.error("Falha ao sincronizar leitura offline: ", err);
                    leiturasQueFalharam.push(leitura);
                }
            }

            // Atualiza o cache offline com as que falharam (se houver) e libera memória do resto
            await AsyncStorage.setItem(OFFLINE_LEITURAS_KEY, JSON.stringify(leiturasQueFalharam));
            return offlineList.length - leiturasQueFalharam.length; // Retorna quantos sincronizaram com sucesso
        } catch (error) {
            console.error("Erro na sincronização de leituras offline: ", error);
            return 0;
        }
    },

    async getLeiturasOfflineCount(): Promise<number> {
        try {
            const existingOffline = await AsyncStorage.getItem(OFFLINE_LEITURAS_KEY);
            if (!existingOffline) return 0;
            const offlineList: Leitura[] = JSON.parse(existingOffline);
            return offlineList.length;
        } catch (e) {
            return 0;
        }
    },

    async getLeiturasByLote(loteId: string): Promise<Leitura[]> {
        try {
            const leituras: Leitura[] = [];

            // 1. Tentar buscar do Firebase
            try {
                const networkState = await NetInfo.fetch();
                if (networkState.isConnected) {
                    const q = query(
                        collection(db, 'leituras'),
                        where("loteId", "==", loteId),
                        orderBy("data", "desc")
                    );
                    const querySnapshot = await getDocs(q);

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
                }
            } catch (firebaseErr) {
                console.warn("Falha ao buscar no Firebase:", firebaseErr);
            }

            // 2. Mesclar com as offline armazenadas localmente
            const existingOffline = await AsyncStorage.getItem(OFFLINE_LEITURAS_KEY);
            if (existingOffline) {
                const offlineList: Leitura[] = JSON.parse(existingOffline);
                const offlineDesteLote = offlineList.filter(l => l.loteId === loteId).map(l => ({
                    ...l,
                    data: new Date(l.data)
                }));
                leituras.unshift(...offlineDesteLote);
            }

            // Ordenar de forma decrescente
            leituras.sort((a, b) => b.data.getTime() - a.data.getTime());

            return leituras;
        } catch (e) {
            console.error("Erro ao buscar leituras: ", e);
            throw e;
        }
    }
};
