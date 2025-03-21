import { useState } from 'react'
import {
    ActivityIndicator,
    Button,
    KeyboardAvoidingView,
    Text,
    TextInput,
    View,
} from 'react-native'

import auth from '@react-native-firebase/auth'

export default function Index() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const signIn = async () => {
        setLoading(true)
        try {
            await auth().signInWithEmailAndPassword(email, password)
        } catch (e) {
            console.error(e)
            alert('Erro ao logar')
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            await auth().createUserWithEmailAndPassword(email, password)
            alert('verifique seu email')
        } catch (e) {
            console.error(e)
            alert('Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <KeyboardAvoidingView>
                <Text style={{ fontSize: 24, marginBottom: 24 }}>Sign In</Text>
                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: 200,
                        marginBottom: 16,
                    }}
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Email"
                />
                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: 200,
                        marginBottom: 16,
                    }}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View>
                        <View style={{ marginBottom: 16 }}>
                            <Button
                                title="Sign In"
                                onPress={signIn}
                                disabled={loading}
                            />
                        </View>
                        <View>
                            <Button
                                title="Sign Up"
                                onPress={signUp}
                                disabled={loading}
                            />
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    )
}
