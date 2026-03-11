import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Alert, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { lotesService, Lote } from '../../services/lotesService';
import { leiturasService, Leitura } from '../../services/leiturasService';
import { avaliarLeitura } from '../../utils/waterQualityRules';
import { Container, Title, SelectLoteButton, SelectLoteText, LeituraCard, LeituraData, StatusBadge, StatusText, ParamText, EmptyText } from './style';

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
      alcalinidade: item.alcalinidade ?? 0,
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
      <ParamText>Alcalinidade: {item.alcalinidade ?? '—'} mg/L</ParamText>
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
