import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserProfile } from '../../services/userService';
import { Container, Label, Input, DisaledInput, ButtonContainer, ButtonText } from './style';

export default function ProfileScreen() {
    const { user, profile, updateProfileContext } = useAuth();
    const [nome, setNome] = useState(profile?.nome || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setNome(profile.nome);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome não pode ser vazio!');
            return;
        }

        if (user && profile) {
            setSaving(true);
            try {
                await userService.updateUserProfile(user.uid, { nome });
                updateProfileContext({ ...profile, nome });
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            } catch (error) {
                Alert.alert('Erro', 'Falha ao salvar as alterações');
            } finally {
                setSaving(false);
            }
        }
    };

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
