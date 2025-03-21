import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { ActivityIndicator, View } from 'react-native'

export default function RootLayout() {
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>()
    const router = useRouter()
    const segments = useSegments()

    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        setUser(user)
        if (initializing) setInitializing(false)
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    useEffect(() => {
        if (initializing) return
        const inAuthGroup = segments[0] === '(auth)'
        if (user && !inAuthGroup) {
            router.replace('/(auth)/home')
        } else if (!user && inAuthGroup) {
            router.replace('/')
        }
    }, [initializing, user])

    if (initializing)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        )

    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    )
}
