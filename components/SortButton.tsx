import { View, Image, StyleSheet, Pressable, Modal, Text, Dimensions,  } from 'react-native'
import React, { useRef, useState } from 'react'
import useThemeColors from '@/hooks/useThemeColors';
import { ThemedText } from '@/components/ThemedText';
import Card from './Card';
import { Row } from './Row';
import { Radio } from './Radio';
import { Shadows } from '@/constants/Shadows';
type Props ={
    value: 'id' | "name",
    onChange: (v : "id" | "name") => void
};

const option = [
    {label: 'Number', value: "id"},
    {label: "Name", value: 'name'}
] as const;
export function SortButton({value, onChange} : Props) {
    const buttonRef = useRef<View>(null)
    const colors = useThemeColors();
    const [isModalVisible, setModalVisibility] = useState(false);
    const [position, setPosition] = useState<null | {top: number, right: number}>(null);
    const onButtonPress = () => {
        buttonRef.current?.measureInWindow((x, y , width, height) => {
            setPosition({
                top: y + height,
                right: Dimensions.get("window").width - x - width
            })
            setModalVisibility(true)
        })
        setModalVisibility( true)
    };
    function onClose() {
        setModalVisibility(false);
    }
  return (
    <>
        <Pressable onPress={onButtonPress}>
            <View ref={buttonRef} style={[styles.button, {backgroundColor: colors.grayWhite}]}>
            
                <Image source={
                    value == "id" ? 
                        require('@/assets/images/number.png') :
                        require('@/assets/images/alpha.png')
                } width={16} height={16}/>
            </View>
        </Pressable>
        <Modal transparent visible={isModalVisible} onRequestClose={onClose} animationType="fade">
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={[styles.popup, {backgroundColor: colors.tint, ...position}]}>
                    <ThemedText  style={styles.title} variant='subtitle2' color='grayWhite' >Sort by:</ThemedText>
                    <Card style={styles.card}>
                        {option.map((o) => ( 
                        <Pressable key={o.value} onPress={() => onChange(o.value)}>
                            <Row  gap={8}>
                                <Radio checked={o.value == value}/>
                                <ThemedText>{o.label}</ThemedText>
                            </Row>
                        </Pressable>
                    ))}
                    </Card>
                </View>
        </Modal>

    </>
  )
}

const styles = StyleSheet.create({
    button: {
        width:32,
        height:32,
        borderRadius:32,
        flex:0,
        alignItems:'center',
        justifyContent:'center'
    },
    backdrop: {
        flex:1,
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    popup: {
        position:'absolute',
        padding:4,
        paddingTop:16,
        gap:16,
        borderRadius: 12,
        width:113,
        ...Shadows.dp2

    },
    title: {
        paddingLeft:20
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal:20,
        gap:16
    }
});