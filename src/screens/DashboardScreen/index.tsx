import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Image, TouchableOpacity, Alert, View, Text, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeContainer, Header, Greeting, Subtitle, MenuGrid, MenuCard, CardText, SyncCard, SyncCardText, Badge, BadgeText } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { leiturasService } from '../../services/leiturasService';
import NetInfo from '@react-native-community/netinfo';

export default function DashboardScreen() {
    const { user, profile } = useAuth();
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    
    const [offlineCount, setOfflineCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    const checkOfflineLeituras = async () => {
        const count = await leiturasService.getLeiturasOfflineCount();
        setOfflineCount(count);
    };

    // Atualiza a contagem de leituras offline sempre que a tela de Dashboard estiver em foco
    useEffect(() => {
        if (isFocused) {
            checkOfflineLeituras();
        }
    }, [isFocused]);

    // Listener automático para quando a internet voltar
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected && offlineCount > 0 && !isSyncing) {
                // Sincroniza em background sem incomodar
                handleSync(true);
            }
        });
        return () => unsubscribe();
    }, [offlineCount, isSyncing]);

    const handleSync = async (isBackground = false) => {
        if (isSyncing || offlineCount === 0) return;
        
        setIsSyncing(true);
        try {
            const network = await NetInfo.fetch();
            if (!network.isConnected) {
                if (!isBackground) {
                    Alert.alert('Sem Conexão', 'Você precisa de internet para sincronizar as leituras.');
                }
                setIsSyncing(false);
                return;
            }

            const synced = await leiturasService.syncOfflineLeituras();
            
            if (synced && synced > 0 && !isBackground) {
                Alert.alert('Sucesso!', `${synced} leitura(s) sincronizada(s) com sucesso. A memória local foi liberada.`);
            } else if (synced === 0 && !isBackground) {
                Alert.alert('Erro', 'Não foi possível sincronizar no momento. Tente novamente mais tarde.');
            }
            
            checkOfflineLeituras();
        } catch (error) {
            if (!isBackground) Alert.alert('Erro', 'Ocorreu um erro ao sincronizar.');
        } finally {
            setIsSyncing(false);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                        source={require('../../assets/logo.png')}
                        style={{ width: 30, height: 30, marginRight: 10, resizeMode: 'contain' }}
                    />
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        AquaInsights
                    </Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Sair do Aplicativo",
                            "Tem certeza de que deseja sair de sua conta?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                {
                                    text: "Sair",
                                    onPress: async () => {
                                        try { await signOut(auth); } 
                                        catch (error) { console.error("Erro ao sair", error); }
                                    },
                                    style: "destructive"
                                }
                            ]
                        );
                    }}
                    style={{ marginRight: 15 }}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="#FFF" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const displayName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Administrador';

    return (
        <SafeContainer>
            <Header>
                <Greeting>
                    Olá, {displayName}!{"\n"}
                    <Subtitle>{profile?.email || user?.email}</Subtitle>
                </Greeting>
            </Header>

            <MenuGrid>
                {offlineCount > 0 && (
                    <SyncCard onPress={() => handleSync(false)} disabled={isSyncing}>
                        <MaterialCommunityIcons name="cloud-sync-outline" size={32} color="#856404" />
                        <SyncCardText>Sincronizar Dados</SyncCardText>
                        {isSyncing ? (
                            <ActivityIndicator color="#856404" size="small" />
                        ) : (
                            <Badge>
                                <BadgeText>{offlineCount}</BadgeText>
                            </Badge>
                        )}
                    </SyncCard>
                )}

                <MenuCard onPress={() => navigation.navigate('Lotes')}>
                    <MaterialCommunityIcons name="fishbowl-outline" size={32} color="#0A74DA" />
                    <CardText>Tanques / Lotes</CardText>
                </MenuCard>
                <MenuCard onPress={() => navigation.navigate('Leitura')}>
                    <MaterialCommunityIcons name="water-percent" size={32} color="#0A74DA" />
                    <CardText>Realizar Leitura</CardText>
                </MenuCard>
                <MenuCard onPress={() => navigation.navigate('Perfil')}>
                    <MaterialCommunityIcons name="account-circle-outline" size={32} color="#0A74DA" />
                    <CardText>Meu Perfil</CardText>
                </MenuCard>
            </MenuGrid>
        </SafeContainer>
    );
}
