import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, View } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { userService } from '../../services/userService';
import { Container, Title, InputGroup, Label, Input, ButtonContainer, ButtonText } from './style';

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
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Image 
                            source={require('../../assets/logo.png')} 
                            style={{ width: 120, height: 120, resizeMode: 'contain' }} 
                        />
                    </View>
                    <Title>AquaInsights</Title>

                    {!isLogin && (
                        <InputGroup>
                            <Label>Nome Completo</Label>
                            <Input
                                placeholder="Ex: João Silva"
                                placeholderTextColor="#7A8C9E"
                                value={nome}
                                onChangeText={setNome}
                                autoCapitalize="words"
                            />
                        </InputGroup>
                    )}

                    <InputGroup>
                        <Label>E-mail</Label>
                        <Input
                            placeholder="Ex: joao@email.com"
                            placeholderTextColor="#7A8C9E"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Senha</Label>
                        <Input
                            placeholder="Sua senha"
                            placeholderTextColor="#7A8C9E"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </InputGroup>

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
