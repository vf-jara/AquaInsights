import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, View } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { userService } from '../../services/userService';
import { Container, Title, InputGroup, Label, Input, ButtonContainer, ButtonText, InputContainer, PasswordIcon } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleAuthentication = async () => {
        if (!email || !password || (!isLogin && (!nome || !confirmPassword))) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        
        if (!isLogin && password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem!');
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
                // Retorna para o modo login após sucesso (opcional, já que o onAuthStateChanged pode redirecionar antes)
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
                    {isLogin && (
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Image 
                                source={require('../../assets/logo.png')} 
                                style={{ width: 120, height: 120, resizeMode: 'contain' }} 
                            />
                        </View>
                    )}
                    
                    <Title>{isLogin ? 'AquaInsights' : 'Cadastro de Novo Usuário'}</Title>

                    {!isLogin && (
                        <InputGroup>
                            <Label>Nome Completo</Label>
                            <InputContainer>
                                <Input
                                    placeholder="Ex: João Silva"
                                    placeholderTextColor="#7A8C9E"
                                    value={nome}
                                    onChangeText={setNome}
                                    autoCapitalize="words"
                                />
                            </InputContainer>
                        </InputGroup>
                    )}

                    <InputGroup>
                        <Label>E-mail</Label>
                        <InputContainer>
                            <Input
                                placeholder="Ex: joao@email.com"
                                placeholderTextColor="#7A8C9E"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </InputContainer>
                    </InputGroup>

                    <InputGroup>
                        <Label>Senha</Label>
                        <InputContainer>
                            <Input
                                placeholder="Sua senha"
                                placeholderTextColor="#7A8C9E"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <PasswordIcon onPress={() => setShowPassword(!showPassword)}>
                                <MaterialCommunityIcons 
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                                    size={20} 
                                    color="#7A8C9E" 
                                />
                            </PasswordIcon>
                        </InputContainer>
                    </InputGroup>

                    {!isLogin && (
                        <InputGroup>
                            <Label>Confirmar Senha</Label>
                            <InputContainer>
                                <Input
                                    placeholder="Digite a senha novamente"
                                    placeholderTextColor="#7A8C9E"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <PasswordIcon onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <MaterialCommunityIcons 
                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                                        size={20} 
                                        color="#7A8C9E" 
                                    />
                                </PasswordIcon>
                            </InputContainer>
                        </InputGroup>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color="#0A74DA" style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            <ButtonContainer onPress={handleAuthentication}>
                                <ButtonText>{isLogin ? 'Entrar' : 'Cadastrar'}</ButtonText>
                            </ButtonContainer>
                            <ButtonContainer variant="secondary" onPress={() => {
                                setIsLogin(!isLogin);
                                // Limpa os campos ao trocar de aba
                                setPassword('');
                                setConfirmPassword('');
                            }}>
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
