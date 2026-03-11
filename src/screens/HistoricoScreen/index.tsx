import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, ActivityIndicator, Alert, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { lotesService, Lote } from '../../services/lotesService';
import { leiturasService, Leitura } from '../../services/leiturasService';
import { avaliarLeitura, avaliarAmonia, avaliarNitrito, avaliarOxigenio, avaliarPh, avaliarTemperatura, avaliarAlcalinidade } from '../../utils/waterQualityRules';
import { Container, Title, HeaderRow, ExportButton, ExportButtonText, FilterRow, LeituraCard, LeituraData, StatusBadge, StatusText, ParamText, EmptyText, PickerContainer } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type HistoricoRouteParams = {
  Historico: { loteId?: string };
};

const DATA_FILTERS = [
  { label: 'Todas as datas', value: '0' },
  { label: 'Últimos 7 dias', value: '7' },
  { label: 'Últimos 15 dias', value: '15' },
  { label: 'Últimos 30 dias', value: '30' },
];

const PARAM_FILTERS = [
  { label: 'Todos Parâmetros', value: 'todos' },
  { label: 'Problemas pH', value: 'ph' },
  { label: 'Problemas Oxigênio', value: 'oxigenio' },
  { label: 'Problemas Temp', value: 'temperatura' },
  { label: 'Problemas Amônia', value: 'amonia' },
  { label: 'Problemas Nitrito', value: 'nitrito' },
  { label: 'Problemas Nitrato', value: 'nitrato' },
  { label: 'Problemas Alcal.', value: 'alcalinidade' },
];

export default function HistoricoScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HistoricoRouteParams, 'Historico'>>();

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(route.params?.loteId || null);

  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterDias, setFilterDias] = useState('0');
  const [filterParam, setFilterParam] = useState('todos');

  useEffect(() => {
    if (user) {
      lotesService.getLotesByUser(user.uid).then(data => {
        setLotes(data);
        if (data.length > 0) {
          const paramLoteId = route.params?.loteId;
          const loteExists = paramLoteId && data.find(l => l.id === paramLoteId);
          setSelectedLoteId(loteExists ? paramLoteId! : data[0].id!);
        } else {
          setLoading(false);
        }
      }).catch(() => {
        Alert.alert('Erro', 'Falha ao carregar tanques');
        setLoading(false);
      });
    }
  }, [user, route.params?.loteId]);

  useEffect(() => {
    if (selectedLoteId) {
      setLoading(true);
      leiturasService.getLeiturasByLote(selectedLoteId)
        .then(data => setLeituras(data))
        .catch(() => Alert.alert('Erro', 'Falha ao buscar leituras do tanque selecionado'))
        .finally(() => setLoading(false));
    }
  }, [selectedLoteId]);

  // Aplicar Múltiplos Filtros
  const filteredLeituras = useMemo(() => {
    let result = [...leituras];

    if (filterDias !== '0') {
      const dias = parseInt(filterDias);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      result = result.filter(l => l.data >= dataLimite);
    }

    if (filterParam !== 'todos') {
      result = result.filter(l => {
        switch (filterParam) {
          case 'ph': return avaliarPh(l.ph).nivel !== 'Ótimo';
          case 'oxigenio': return avaliarOxigenio(l.oxigenio).nivel !== 'Ótimo';
          case 'temperatura': return avaliarTemperatura(l.temperatura).nivel !== 'Ótimo';
          case 'amonia': return avaliarAmonia(l.amonia).nivel !== 'Ótimo';
          case 'nitrito': return avaliarNitrito(l.nitrito).nivel !== 'Ótimo';
          case 'alcalinidade': return avaliarAlcalinidade(l.alcalinidade ?? 0).nivel !== 'Ótimo';
          default: return true;
        }
      });
    }

    return result;
  }, [leituras, filterDias, filterParam]);

  const handleExportCSV = async () => {
    if (filteredLeituras.length === 0) {
      Alert.alert('Aviso', 'Não há dados para exportar.');
      return;
    }

    try {
      const header = 'Data,Hora,pH,Oxigenio (mg/L),Temperatura (°C),Amonia (mg/L),Nitrito (mg/L),Nitrato (mg/L),Alcalinidade (mg/L),Status\n';
      const rows = filteredLeituras.map(l => {
        const dataStr = l.data.toLocaleDateString();
        const horaStr = l.data.toLocaleTimeString().slice(0, 5);
        return `${dataStr},${horaStr},${l.ph},${l.oxigenio},${l.temperatura},${l.amonia},${l.nitrito},${l.nitrato},${l.alcalinidade ?? ''},${l.status}`;
      }).join('\n');

      const csvContent = header + rows;
      
      const file = new FileSystem.File(FileSystem.Paths.document, `relatorio_lote_${selectedLoteId}.csv`);
      file.write(csvContent, { encoding: 'utf8' });
      const fileUri = file.uri;
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exportar Histórico CSV',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao gerar ou exportar o arquivo.');
    }
  };

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
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ExportButton onPress={handleExportCSV}>
          <MaterialCommunityIcons name="export-variant" size={20} color="#FFF" />
          <ExportButtonText>Exportar</ExportButtonText>
        </ExportButton>
      </View>

      {lotes.length > 0 && (
        <PickerContainer>
          <Picker
            selectedValue={selectedLoteId}
            onValueChange={(itemValue) => setSelectedLoteId(itemValue)}
            style={{ height: 50, width: '100%', color: '#2D3748' }}
          >
            {lotes.map(lote => (
              <Picker.Item key={lote.id} label={`Lote #${lote.numeroLote}`} value={lote.id} />
            ))}
          </Picker>
        </PickerContainer>
      )}

      {/* Row for Data / Parameter dropdown filters */}
      <FilterRow>
        <View style={{ flex: 1, marginRight: 8 }}>
          <PickerContainer style={{ marginBottom: 0 }}>
            <Picker
              selectedValue={filterDias}
              onValueChange={(itemValue) => setFilterDias(itemValue)}
              style={{ height: 50, width: '100%', color: '#2D3748' }}
            >
              {DATA_FILTERS.map(f => (
                <Picker.Item key={f.value} label={f.label} value={f.value} />
              ))}
            </Picker>
          </PickerContainer>
        </View>
        <View style={{ flex: 1.2 }}>
          <PickerContainer style={{ marginBottom: 0 }}>
            <Picker
              selectedValue={filterParam}
              onValueChange={(itemValue) => setFilterParam(itemValue)}
              style={{ height: 50, width: '100%', color: '#2D3748' }}
            >
              {PARAM_FILTERS.map(f => (
                <Picker.Item key={f.value} label={f.label} value={f.value} />
              ))}
            </Picker>
          </PickerContainer>
        </View>
      </FilterRow>

      {loading ? (
        <ActivityIndicator size="large" color="#0A74DA" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredLeituras}
          keyExtractor={item => item.id!}
          renderItem={renderLeitura}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<EmptyText>Nenhuma leitura encontrada para os filtros selecionados.</EmptyText>}
        />
      )}
    </Container>
  );
}
