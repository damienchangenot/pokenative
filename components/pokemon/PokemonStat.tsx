import { View, Text, StyleSheet, type ViewProps } from 'react-native'
import React, { useEffect } from 'react'
import { Row } from '../Row'
import { ThemedText } from '../ThemedText';
import useThemeColors from '@/hooks/useThemeColors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring }  from 'react-native-reanimated';

type Props = ViewProps &  {
    color: string;
    name: string;
    value: number;
}

function statShortName(name: string): string{
    return name
        .replaceAll("special", "S")
        .replaceAll("-", "")
        .replaceAll("attack", "ATK")
        .replaceAll("defense", "DEF")
        .replaceAll('speed', 'SPD')
        .toUpperCase()
}
export default function PokemonStat({style, color, name, value, ...rest}: Props ) {
    const colors = useThemeColors();
    const sharedValue = useSharedValue(value);
    const barInnerStyle = useAnimatedStyle(() => {
        return {
            flex: sharedValue.value
        }
    })

    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: 255 - sharedValue.value
        }
    })

    useEffect(() => {
        sharedValue.value = withSpring(value)
    }, [value])
  return (
    <Row gap={8}>
        <View style={[styles.name, {borderColor: colors.grayLight}]}>
            <ThemedText variant='subtitle3' style={{color: color}}>
                {statShortName(name)}
            </ThemedText>
        </View>
        <View style={styles.number}>
            <ThemedText>{value.toString().padStart(3, '0')}</ThemedText>
        </View>
        <Row style={styles.bar}>
            <Animated.View style={[styles.barInner, { backgroundColor: color}, barInnerStyle ]}/>
            <Animated.View style={[styles.barBackground, {backgroundColor: color}, barBackgroundStyle]}/>       
        </Row>
    </Row>
  )
}

const styles = StyleSheet.create({
    root: {},
    name: {
        width:40,
        paddingRight:8,
        borderRightWidth:1,
        borderStyle:'solid',
    },
    number: {
        width:23,
    },
    bar: {
        borderRadius:20,
        height:4,
        overflow: 'hidden',
        flex:1,
    },
    barInner: {
        height:4,

    },
    barBackground: {
        height:4,
        opacity: 0.24,
    }
})