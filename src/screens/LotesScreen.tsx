import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { FlatList, Alert, ActivityIndicator, Modal } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { lotesService, Lote } from '../services/lotesService';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const LoteCard = styled.View`
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

const LoteTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const LoteSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 16px;
`;

/* Modal Styles */
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 90%;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-size: 16px;
  border: 1px solid #E2E8F0;
`;

const ModalActionRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const ModalButton = styled.TouchableOpacity<{ isPrimary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme, isPrimary }) => isPrimary ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const ModalButtonText = styled.Text<{ isPrimary?: boolean }>`
  color: ${({ theme, isPrimary }) => isPrimary ? '#FFF' : theme.colors.textLight};
  font-weight: bold;
`;

export default function LotesScreen() {
  const { user } = useAuth();
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
    <LoteCard>
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
