import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-width: 1px;
  border-color: #E2E8F0;
`;

const ButtonContainer = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) => variant === 'secondary' ? 'transparent' : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  border: ${({ theme, variant }) => variant === 'secondary' ? `1px solid ${theme.colors.primary}` : 'none'};
`;

const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
  color: ${({ theme, variant }) => variant === 'secondary' ? theme.colors.primary : '#FFF'};
  font-size: 16px;
  font-weight: bold;
`;

export default function LoginScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleAuthentication = async () => {
        if (!email || !password || (!isLogin && !nome)) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Salvar o perfil do usuário no Firestore
                await userService.createUserProfile(userCredential.user.uid, nome, email);
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
            }
        } catch (error: any) {
            Alert.alert('Falha na Autenticação', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Title>AquaInsights</Title>

                    {!isLogin && (
                        <Input
                            placeholder="Nome Completo"
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                        />
                    )}

                    <Input
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {loading ? (
                        <ActivityIndicator size="large" color="#0A74DA" style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            <ButtonContainer onPress={handleAuthentication}>
                                <ButtonText>{isLogin ? 'Entrar' : 'Cadastrar'}</ButtonText>
                            </ButtonContainer>
                            <ButtonContainer variant="secondary" onPress={() => setIsLogin(!isLogin)}>
                                <ButtonText variant="secondary">
                                    {isLogin ? 'Criar uma conta' : 'Já tenho conta'}
                                </ButtonText>
                            </ButtonContainer>
                        </>
                    )}
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
