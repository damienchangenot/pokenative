import { ImageSourcePropType, StyleSheet, Text, View, type ViewProps , Image} from 'react-native'
import React from 'react'
import { Row } from '../Row';
import { ThemedText } from '../ThemedText';
type Props = ViewProps & {
    title ?: string;
    description ?: string;
    image ?: ImageSourcePropType
}
export default function PokemonSpec({style, image, title, description, ...rest}: Props) {
  return (
    <View style={[style, styles.root]} {...rest}>
        <Row style={styles.row}>
            {image && <Image source={image} width={16} height={16}></Image>}
            <ThemedText>{title}</ThemedText>
        </Row>
        <ThemedText variant='caption' color='grayMedium'>
            {description}    
        </ThemedText>   
    </View>
  )
}

const styles = StyleSheet.create({
    root: {
        flex:1,
        gap:4,
        alignItems:'center',
    },
    row: {
        height:32,
        alignItems:'center',
    }
})