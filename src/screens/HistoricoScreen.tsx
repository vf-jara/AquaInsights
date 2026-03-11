import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { FlatList, ActivityIndicator, Alert, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { lotesService, Lote } from '../services/lotesService';
import { leiturasService, Leitura } from '../services/leiturasService';
import { avaliarLeitura } from '../utils/waterQualityRules';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SelectLoteButton = styled.TouchableOpacity<{ isSelected?: boolean }>`
  background-color: ${({ theme, isSelected }) => isSelected ? theme.colors.secondary : theme.colors.card};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme, isSelected }) => isSelected ? theme.colors.secondary : '#E2E8F0'};
`;

const SelectLoteText = styled.Text<{ isSelected?: boolean }>`
  color: ${({ theme, isSelected }) => isSelected ? '#FFF' : theme.colors.text};
  font-weight: ${({ isSelected }) => isSelected ? 'bold' : 'normal'};
`;

const LeituraCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const LeituraData = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ theme, status }) => status === 'Normal' ? theme.colors.success : theme.colors.danger};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const StatusText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

const ParamText = styled.Text`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 16px;
`;

export default function HistoricoScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);

  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      lotesService.getLotesByUser(user.uid).then(data => {
        setLotes(data);
        if (data.length > 0) {
          setSelectedLoteId(data[0].id!);
        } else {
          setLoading(false);
        }
      }).catch(() => {
        Alert.alert('Erro', 'Falha ao carregar tanques');
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedLoteId) {
      setLoading(true);
      leiturasService.getLeiturasByLote(selectedLoteId)
        .then(data => setLeituras(data))
        .catch(() => Alert.alert('Erro', 'Falha ao buscar leituras do tanque selecionado'))
        .finally(() => setLoading(false));
    }
  }, [selectedLoteId]);

  const renderLoteFilter = ({ item }: { item: Lote }) => (
    <SelectLoteButton
      isSelected={selectedLoteId === item.id}
      onPress={() => setSelectedLoteId(item.id!)}
    >
      <SelectLoteText isSelected={selectedLoteId === item.id}>Lote #{item.numeroLote}</SelectLoteText>
    </SelectLoteButton>
  );

  const handleOpenOrientacao = (item: Leitura) => {
    const avaliacao = avaliarLeitura({
      temperatura: item.temperatura,
      oxigenio: item.oxigenio,
      ph: item.ph,
      amonia: item.amonia,
      nitrito: item.nitrito,
      nitrato: item.nitrato,
      dureza: item.dureza ?? 0,
    });
    navigation.navigate('Orientacao', { avaliacao });
  };

  const renderLeitura = ({ item }: { item: Leitura }) => (
    <LeituraCard onPress={() => handleOpenOrientacao(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <LeituraData>{item.data.toLocaleDateString()} - {item.data.toLocaleTimeString().slice(0, 5)}</LeituraData>
        <StatusBadge status={item.status}>
          <StatusText>{item.status}</StatusText>
        </StatusBadge>
      </View>
      <ParamText>pH: {item.ph}</ParamText>
      <ParamText>OD: {item.oxigenio} mg/L</ParamText>
      <ParamText>Temp: {item.temperatura} °C</ParamText>
      <ParamText>Amônia: {item.amonia} mg/L</ParamText>
      <ParamText>Nitrito: {item.nitrito} mg/L | Nitrato: {item.nitrato} mg/L</ParamText>
      <ParamText>Dureza: {item.dureza ?? '—'} mg/L</ParamText>
    </LeituraCard>
  );

  return (
    <Container>
      <Title>Histórico de Leituras</Title>

      {lotes.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={lotes}
            keyExtractor={item => item.id!}
            renderItem={renderLoteFilter}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0A74DA" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={leituras}
          keyExtractor={item => item.id!}
          renderItem={renderLeitura}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<EmptyText>Nenhuma leitura encontrada para este tanque.</EmptyText>}
        />
      )}
    </Container>
  );
}
