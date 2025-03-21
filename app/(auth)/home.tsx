import { Button, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'

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
        </View>
    )
}
