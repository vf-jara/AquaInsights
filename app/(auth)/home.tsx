import { Button, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Link, useRouter } from 'expo-router'

export default function Home() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Home</Text>
            <Button title="Sign Out" onPress={() => auth().signOut()} />
            <Link href="/(auth)/batchRegistry">
                <Text>BatchRegistry</Text>
            </Link>
            <Link href="/(auth)/batchList">
                <Text>List</Text>
            </Link>
        </View>
    )
}
