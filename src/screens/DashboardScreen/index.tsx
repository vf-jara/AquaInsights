import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { userService, UserProfile } from '../../services/userService';
import { Container, Header, Greeting, Subtitle, MenuGrid, MenuCard, CardText, LogoutButton, LogoutText } from './style';

export default function DashboardScreen() {
    const { user } = useAuth();
    const navigation = useNavigation<any>();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user) {
            userService.getUserProfile(user.uid).then(data => {
                setProfile(data);
            });
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    };

    const displayName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Administrador';

    return (
        <Container>
            <Header>
                <Greeting>
                    Olá, {displayName}!{"\n"}
                    <Subtitle>{profile?.email || user?.email}</Subtitle>
                </Greeting>
            </Header>

            <MenuGrid>
                <MenuCard onPress={() => navigation.navigate('Lotes')}>
                    <CardText>Tanques / Lotes</CardText>
                </MenuCard>
                <MenuCard onPress={() => navigation.navigate('Leitura')}>
                    <CardText>Realizar Leitura</CardText>
                </MenuCard>
                <MenuCard onPress={() => navigation.navigate('Historico')}>
                    <CardText>Histórico de Leituras</CardText>
                </MenuCard>
                <MenuCard onPress={() => navigation.navigate('Perfil')}>
                    <CardText>Meu Perfil</CardText>
                </MenuCard>
            </MenuGrid>

            <LogoutButton onPress={handleLogout}>
                <LogoutText>Sair do App</LogoutText>
            </LogoutButton>
        </Container>
    );
}
