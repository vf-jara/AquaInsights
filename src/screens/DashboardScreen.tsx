import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { userService, UserProfile } from '../services/userService';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const Greeting = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MenuGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const MenuCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  width: 48%;
  height: 120px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 3;
`;

const CardText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const LogoutButton = styled.TouchableOpacity`
  margin-top: auto;
  align-self: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const LogoutText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 16px;
  font-weight: bold;
`;

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
