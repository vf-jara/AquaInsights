import React, { useLayoutEffect } from 'react';
import { Image, TouchableOpacity, Alert, View, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeContainer, Header, Greeting, Subtitle, MenuGrid, MenuCard, CardText } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
    const { user, profile } = useAuth();
    const navigation = useNavigation<any>();

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
                                {
                                    text: "Cancelar",
                                    style: "cancel"
                                },
                                {
                                    text: "Sair",
                                    onPress: async () => {
                                        try {
                                            await signOut(auth);
                                        } catch (error) {
                                            console.error("Erro ao sair", error);
                                        }
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
