import { Stack } from 'expo-router'

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="home" />
            <Stack.Screen name="batchRegistry" />
            <Stack.Screen name="batchList" />
        </Stack>
    )
}
