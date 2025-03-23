import React, { useState } from 'react'
import { TextInput, Button, Alert, ActivityIndicator, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function BatchRegistry() {
    const [batchNumber, setBatchNumber] = useState('')
    const [species, setSpecies] = useState('Tilápia-do-nilo')
    const [farmType, setFarmType] = useState('Viveiro escavado')
    const [loading, setLoading] = useState(false)

    const date = new Date()
    console.log(date)

    async function submitBatch() {
        const userID = auth().currentUser?.uid
        const date = new Date()

        if (!userID) {
            Alert.alert('Erro', 'Usuário não autenticado.')
            return
        }

        if (!batchNumber.trim()) {
            Alert.alert('Erro', 'O número do lote é obrigatório.')
            return
        }

        try {
            setLoading(true)
            await firestore().collection('batches').add({
                batchNumber,
                species,
                farmType,
                userID,
                timestamp: date,
            })

            Alert.alert('Sucesso', 'Lote registrado com sucesso!')
            setBatchNumber('')
        } catch (error) {
            console.log('Error adding batch: ', error)
            Alert.alert('Erro', 'Não foi possível registrar o lote.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <TextInput
                placeholder="Número do Lote"
                value={batchNumber}
                onChangeText={setBatchNumber}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Espécie"
                value={species}
                onChangeText={setSpecies}
                editable={false}
                style={styles.input}
            />
            <TextInput
                placeholder="Tipo de viveiro"
                value={farmType}
                onChangeText={setFarmType}
                editable={false}
                style={styles.input}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Registrar Lote" onPress={submitBatch} />
            )}
        </View>
    )
}

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 8,
        width: '80%',
    },
})
