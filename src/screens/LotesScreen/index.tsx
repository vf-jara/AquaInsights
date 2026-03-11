import React, { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator, Modal } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { lotesService, Lote } from '../../services/lotesService';
import { Container, HeaderRow, Title, AddButton, AddButtonText, LoteCard, LoteTitle, LoteSubtitle, EmptyText, ModalOverlay, ModalContent, ModalTitle, Input, ModalActionRow, ModalButton, ModalButtonText } from './style';

export default function LotesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  // Form State
  const [numeroLote, setNumeroLote] = useState('');
  const [especieId, setEspecieId] = useState(''); // Normally a dropdown/picker
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLotes();
  }, [user]);

  const fetchLotes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await lotesService.getLotesByUser(user.uid);
      setLotes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os lotes.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLote = async () => {
    if (!numeroLote.trim() || !especieId.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setIsSubmitting(true);
      await lotesService.createLote({
        numeroLote,
        especieId,
        userId: user!.uid
      });
      setModalVisible(false);
      setNumeroLote('');
      setEspecieId('');
      fetchLotes(); // Refresh list
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Lote }) => (
    <LoteCard onPress={() => navigation.navigate('Historico', { loteId: item.id })}>
      <LoteTitle>Lote #{item.numeroLote}</LoteTitle>
      <LoteSubtitle>Espécie ID: {item.especieId}</LoteSubtitle>
      <LoteSubtitle>Criado em: {item.dataCriacao.toLocaleDateString()}</LoteSubtitle>
    </LoteCard>
  );

  return (
    <Container>
      <HeaderRow>
        <Title>Meus Tanques</Title>
        <AddButton onPress={() => setModalVisible(true)}>
          <AddButtonText>+ Novo</AddButtonText>
        </AddButton>
      </HeaderRow>

      {loading ? (
        <ActivityIndicator size="large" color="#0A74DA" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={lotes}
          keyExtractor={(item) => item.id!}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<EmptyText>Nenhum tanque cadastrado ainda.</EmptyText>}
        />
      )}

      <Modal visible={isModalVisible} transparent animationType="fade">
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Novo Lote / Tanque</ModalTitle>

            <Input
              placeholder="Identificador do Lote (ex: Tanque 01)"
              value={numeroLote}
              onChangeText={setNumeroLote}
            />
            {/* TODO: Substituir por um Picker de espécies buscando do BD */}
            <Input
              placeholder="Nome da Espécie (ex: Tilápia)"
              value={especieId}
              onChangeText={setEspecieId}
            />

            <ModalActionRow>
              <ModalButton onPress={() => setModalVisible(false)} disabled={isSubmitting}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              <ModalButton isPrimary onPress={handleCreateLote} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <ModalButtonText isPrimary>Salvar</ModalButtonText>
                )}
              </ModalButton>
            </ModalActionRow>
          </ModalContent>
        </ModalOverlay>
      </Modal>

    </Container>
  );
}
