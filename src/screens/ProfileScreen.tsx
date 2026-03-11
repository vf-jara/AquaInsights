import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userService, UserProfile } from '../services/userService';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-width: 1px;
  border-color: #E2E8F0;
`;

const DisaledInput = styled(Input)`
  background-color: #E2E8F0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const ButtonText = styled.Text`
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
`;

export default function ProfileScreen() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            userService.getUserProfile(user.uid).then(data => {
                if (data) {
                    setProfile(data);
                    setNome(data.nome);
                }
                setLoading(false);
            }).catch(() => {
                Alert.alert('Erro', 'Falha ao carregar perfil');
                setLoading(false);
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome não pode ser vazio!');
            return;
        }

        if (user) {
            setSaving(true);
            try {
                await userService.updateUserProfile(user.uid, { nome });
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            } catch (error) {
                Alert.alert('Erro', 'Falha ao salvar as alterações');
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0A74DA" />
            </Container>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Label>Nome Completo</Label>
                    <Input
                        placeholder="Seu nome"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                    />

                    <Label>E-mail (Acesso Seguro)</Label>
                    <DisaledInput
                        value={user?.email || profile?.email || ''}
                        editable={false}
                    />

                    <Label>Membro Desde</Label>
                    <DisaledInput
                        value={profile?.dataCadastro ? profile.dataCadastro.toLocaleDateString() : ''}
                        editable={false}
                    />

                    <ButtonContainer onPress={handleSave} disabled={saving}>
                        {saving ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <ButtonText>Salvar Alterações</ButtonText>
                        )}
                    </ButtonContainer>

                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
