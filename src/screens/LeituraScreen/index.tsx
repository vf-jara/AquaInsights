import React, { useState, useEffect, useRef } from 'react';
import { Alert, ActivityIndicator, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { lotesService, Lote } from '../../services/lotesService';
import { leiturasService } from '../../services/leiturasService';
import { useNavigation } from '@react-navigation/native';
import { avaliarLeitura } from '../../utils/waterQualityRules';
import { Container, ContentOffset, Title, Label, SectionTitle, InputGroup, inputStyle, dropdownStyles, ActionButton, ActionButtonText } from './style';

export default function LeituraScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(true);

  // Form
  const [selectedLote, setSelectedLote] = useState<string>('');
  const [ph, setPh] = useState('');
  const [oxigenio, setOxigenio] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [amonia, setAmonia] = useState('');
  const [nitrito, setNitrito] = useState('');
  const [nitrato, setNitrato] = useState('');
  const [alcalinidade, setAlcalinidade] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const phRef = useRef<TextInput>(null);
  const oxigenioRef = useRef<TextInput>(null);
  const temperaturaRef = useRef<TextInput>(null);
  const amoniaRef = useRef<TextInput>(null);
  const nitritoRef = useRef<TextInput>(null);
  const nitratoRef = useRef<TextInput>(null);
  const alcalinidadeRef = useRef<TextInput>(null);

  useEffect(() => {
    if (user) {
      lotesService.getLotesByUser(user.uid).then(data => {
        setLotes(data);
        setLoadingLotes(false);
      }).catch(() => {
        Alert.alert('Erro', 'Falha ao carregar tanques disponíveis');
        setLoadingLotes(false);
      });
    }
  }, [user]);

  const handleSaveLeitura = async () => {
    if (!selectedLote) {
      Alert.alert('Atenção', 'Selecione um tanque / lote primeiro.');
      return;
    }
    if (!ph || !oxigenio || !temperatura || !amonia || !nitrito || !nitrato || !alcalinidade) {
      Alert.alert('Atenção', 'Preencha todos os parâmetros da água.');
      return;
    }

    const leituraData = {
      loteId: selectedLote,
      ph: parseFloat(ph.replace(',', '.')),
      oxigenio: parseFloat(oxigenio.replace(',', '.')),
      temperatura: parseFloat(temperatura.replace(',', '.')),
      amonia: parseFloat(amonia.replace(',', '.')),
      nitrito: parseFloat(nitrito.replace(',', '.')),
      nitrato: parseFloat(nitrato.replace(',', '.')),
      alcalinidade: parseFloat(alcalinidade.replace(',', '.')),
    };

    try {
      setIsSubmitting(true);
      const { avaliacao } = await leiturasService.registerLeitura(leituraData);
      navigation.replace('Orientacao', { avaliacao });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a leitura.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Container keyboardShouldPersistTaps="handled">
        <ContentOffset>
          <Title>Nova Leitura</Title>

          <Label>Selecione o Tanque (Lote):</Label>
          {loadingLotes ? (
            <ActivityIndicator size="small" color="#0A74DA" style={{ marginBottom: 16 }} />
          ) : lotes.length === 0 ? (
            <Label style={{ color: 'red', marginBottom: 16 }}>Nenhum tanque cadastrado. Crie um tanque primeiro.</Label>
          ) : (
            <Dropdown
              search={false}
              style={dropdownStyles.dropdown}
              placeholderStyle={dropdownStyles.placeholderStyle}
              selectedTextStyle={dropdownStyles.selectedTextStyle}
              itemContainerStyle={dropdownStyles.itemContainerStyle}
              itemTextStyle={dropdownStyles.itemTextStyle}
              data={lotes.map(l => ({
                label: `Lote #${l.numeroLote} (${l.especieId})`,
                value: l.id!
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Selecione um tanque..."
              value={selectedLote}
              onFocus={() => Keyboard.dismiss()}
              onChange={item => {
                setSelectedLote(item.value);
                setTimeout(() => phRef.current?.focus(), 100);
              }}
              keyboardAvoiding={false}
              autoScroll={false}
            />
          )}

          <SectionTitle style={{ marginTop: 16 }}>Parâmetros da Água:</SectionTitle>

          <InputGroup>
            <Label>pH</Label>
            <TextInput
              ref={phRef}
              style={inputStyle}
              placeholder="Ex: 7.0"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={ph}
              onChangeText={setPh}
              returnKeyType="next"
              onSubmitEditing={() => oxigenioRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Oxigênio Dissolvido (mg/L)</Label>
            <TextInput
              ref={oxigenioRef}
              style={inputStyle}
              placeholder="Ex: 5.5"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={oxigenio}
              onChangeText={setOxigenio}
              returnKeyType="next"
              onSubmitEditing={() => temperaturaRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Temperatura (°C)</Label>
            <TextInput
              ref={temperaturaRef}
              style={inputStyle}
              placeholder="Ex: 28.5"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={temperatura}
              onChangeText={setTemperatura}
              returnKeyType="next"
              onSubmitEditing={() => amoniaRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Amônia (mg/L)</Label>
            <TextInput
              ref={amoniaRef}
              style={inputStyle}
              placeholder="Ex: 0.25"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={amonia}
              onChangeText={setAmonia}
              returnKeyType="next"
              onSubmitEditing={() => nitritoRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Nitrito (mg/L)</Label>
            <TextInput
              ref={nitritoRef}
              style={inputStyle}
              placeholder="Ex: 0.1"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={nitrito}
              onChangeText={setNitrito}
              returnKeyType="next"
              onSubmitEditing={() => nitratoRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Nitrato (mg/L)</Label>
            <TextInput
              ref={nitratoRef}
              style={inputStyle}
              placeholder="Ex: 10.0"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={nitrato}
              onChangeText={setNitrato}
              returnKeyType="next"
              onSubmitEditing={() => alcalinidadeRef.current?.focus()}
            />
          </InputGroup>

          <InputGroup>
            <Label>Alcalinidade (mg/L)</Label>
            <TextInput
              ref={alcalinidadeRef}
              style={inputStyle}
              placeholder="Ex: 120.0"
              placeholderTextColor="#7A8C9E"
              keyboardType="numeric"
              value={alcalinidade}
              onChangeText={setAlcalinidade}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </InputGroup>

          <ActionButton onPress={handleSaveLeitura} disabled={isSubmitting || lotes.length === 0}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <ActionButtonText>Salvar Leitura</ActionButtonText>
            )}
          </ActionButton>

        </ContentOffset>
      </Container>
    </KeyboardAvoidingView>
  );
}
