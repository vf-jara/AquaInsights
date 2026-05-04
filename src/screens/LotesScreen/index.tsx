import React, { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator, Modal, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { lotesService, Lote } from '../../services/lotesService';
import { Container, HeaderRow, Title, AddButton, AddButtonText, LoteCard, LoteHeader, LoteTitle, LoteActionRow, LoteActionButton, LoteSubtitle, EmptyText, ModalOverlay, ModalContent, ModalTitle, Input, ModalActionRow, ModalButton, ModalButtonText } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LotesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  // Form State
  const [editingLoteId, setEditingLoteId] = useState<string | null>(null);
  const [numeroLote, setNumeroLote] = useState('');
  const [especieId, setEspecieId] = useState('');
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

  const openModalForCreate = () => {
    setEditingLoteId(null);
    setNumeroLote('');
    setEspecieId('');
    setModalVisible(true);
  };

  const openModalForEdit = (lote: Lote) => {
    setEditingLoteId(lote.id!);
    setNumeroLote(lote.numeroLote);
    setEspecieId(lote.especieId);
    setModalVisible(true);
  };

  const handleSaveLote = async () => {
    if (!numeroLote.trim() || !especieId.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingLoteId) {
        await lotesService.updateLote(editingLoteId, {
          numeroLote,
          especieId,
        });
      } else {
        await lotesService.createLote({
          numeroLote,
          especieId,
          userId: user!.uid
        });
      }
      setModalVisible(false);
      fetchLotes();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLote = (loteId: string) => {
    Alert.alert(
      "Atenção: Ação Irreversível",
      "Tem certeza de que deseja excluir permanentemente este lote? O histórico será perdido.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await lotesService.deleteLote(loteId);
              fetchLotes();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir o lote.');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Lote }) => (
    <LoteCard onPress={() => navigation.navigate('Historico', { loteId: item.id })}>
      <LoteHeader>
        <LoteTitle>Lote #{item.numeroLote}</LoteTitle>
        <LoteActionRow>
          <LoteActionButton
            onPress={(e: any) => {
              e.stopPropagation();
              openModalForEdit(item);
            }}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#0A74DA" />
          </LoteActionButton>
          <LoteActionButton
            onPress={(e: any) => {
              e.stopPropagation();
              handleDeleteLote(item.id!);
            }}
          >
            <MaterialCommunityIcons name="delete-outline" size={20} color="#F56565" />
          </LoteActionButton>
        </LoteActionRow>
      </LoteHeader>
      <LoteSubtitle>Espécie: {item.especieId}</LoteSubtitle>
      <LoteSubtitle>Criado em: {item.dataCriacao.toLocaleDateString()}</LoteSubtitle>
    </LoteCard>
  );

  return (
    <Container>
      <HeaderRow>
        <Title>Meus Tanques</Title>
        <AddButton onPress={openModalForCreate}>
          <AddButtonText>+ Novo</AddButtonText>
        </AddButton>
      </HeaderRow>

      {loading && !isSubmitting ? (
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
            <ModalTitle>{editingLoteId ? 'Editar Lote / Tanque' : 'Novo Lote / Tanque'}</ModalTitle>

            <Input
              placeholder="Identificador do Lote"
              placeholderTextColor="#7A8C9E"
              value={numeroLote}
              onChangeText={setNumeroLote}
            />
            {/* TODO: Substituir por um Picker de espécies buscando do BD */}
            <Input
              placeholder="Nome da Espécie (ex: Tilápia)"
              placeholderTextColor="#7A8C9E"
              value={especieId}
              onChangeText={setEspecieId}
            />

            <ModalActionRow>
              <ModalButton onPress={() => setModalVisible(false)} disabled={isSubmitting}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              <ModalButton isPrimary onPress={handleSaveLote} disabled={isSubmitting}>
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
