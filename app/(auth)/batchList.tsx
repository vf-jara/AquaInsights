import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, ActivityIndicator, Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function BatchList() {
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userID = auth().currentUser?.uid

        if (!userID) {
            Alert.alert('Erro', 'Usuário não autenticado.')
            return
        }

        const unsubscribe = firestore()
            .collection('batches')
            .where('userID', '==', userID)
            .orderBy('timestamp', 'desc')
            .onSnapshot(
                (snapshot) => {
                    const batchList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    setBatches(batchList)
                    setLoading(false)
                },
                (error) => {
                    console.log('Error fetching batches: ', error)
                    Alert.alert('Erro', 'Não foi possível carregar os lotes.')
                    setLoading(false)
                },
            )

        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loading}
            />
        )
    }

    if (batches.length === 0) {
        return <Text style={styles.emptyText}>Nenhum lote encontrado.</Text>
    }

    return (
        <FlatList
            data={batches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.batchItem}>
                    <Text style={styles.batchText}>
                        Lote: {item.batchNumber}
                    </Text>
                    <Text style={styles.batchText}>
                        Espécie: {item.species}
                    </Text>
                    <Text style={styles.batchText}>Tipo: {item.farmType}</Text>
                    <Text style={styles.batchText}>
                        Data:{' '}
                        {item.timestamp.toDate().toLocaleDateString('pt-BR')}
                    </Text>
                    <Text style={styles.batchText}>
                        Hora:{' '}
                        {item.timestamp.toDate().toLocaleTimeString('pt-BR')}
                    </Text>
                </View>
            )}
        />
    )
}

const styles = {
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        flex: 1,
        justifyContent: 'center',
        fontSize: 16,
    },
    batchItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
    },
    batchText: {
        fontSize: 16,
        color: '#333',
    },
}
