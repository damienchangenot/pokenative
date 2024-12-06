import { View, Text, ViewStyle, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Card from '@/components/Card'
import { ThemedText } from '@/components/ThemedText'
import useThemeColors from '@/hooks/useThemeColors'
import { Link } from 'expo-router'
import { getPokemonArtwork } from '@/functions/pokemon'

type Props = {
    style ?: ViewStyle,
    id: number,
    name: string
}
export default function PokemonCard( {style, id, name} : Props) {
    const colors = useThemeColors()
  return (
    <Link href={{pathname:"/pokemon/[id]", params: {id: id}}} asChild>
        <Pressable style={style}>
            <Card style={styles.card}>
            <View style={[styles.shadow, {backgroundColor: colors.grayBackground} ]}/>
            <ThemedText style={styles.id} variant='caption' color='grayMedium'>#{id.toString().padStart(3, '0')}</ThemedText>
            <Image source={{ uri: getPokemonArtwork(id)}} 
                height={72}
                width={72}></Image>
            <ThemedText>{name}</ThemedText>
            
        </Card>
        </Pressable>
    </Link>
    /*
    */
  )
}

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        alignItems: 'center',
        padding: 4
    },
    id: {
        alignSelf: 'flex-end'
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0,
        height: 44,
        borderRadius: 7
    }
})