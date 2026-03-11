import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import LotesScreen from '../screens/LotesScreen';
import LeituraScreen from '../screens/LeituraScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrientacaoScreen from '../screens/OrientacaoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#0A74DA' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'AquaInsights' }} />
            <Stack.Screen name="Lotes" component={LotesScreen} options={{ title: 'Gerenciar Tanques' }} />
            <Stack.Screen name="Leitura" component={LeituraScreen} options={{ title: 'Nova Leitura' }} />
            <Stack.Screen name="Orientacao" component={OrientacaoScreen} options={{ title: 'Orientação' }} />
            <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
            <Stack.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
        </Stack.Navigator>
    );
}
