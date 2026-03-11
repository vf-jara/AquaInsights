import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserProfile } from '../../services/userService';
import { Container, Label, Input, DisaledInput, ButtonContainer, ButtonText } from './style';

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
