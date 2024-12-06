import { Pressable, StyleSheet, Image, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { RouteView } from '@/components/RouteView'
import { Row } from '@/components/Row'
import { ThemedText } from '@/components/ThemedText'
import useFetchQuery from '@/hooks/useFetchQuery'
import { Colors } from '@/constants/Color'
import useThemeColors from '@/hooks/useThemeColors'
import { basePokemonStats, formatWeight, getPokemonArtwork } from '@/functions/pokemon'
import Card from '@/components/Card'
import { PokemonType } from '@/components/pokemon/PokemonType'
import PokemonSpec from '@/components/pokemon/PokemonSpec'
import PokemonStat from '@/components/pokemon/PokemonStat'
import { Audio } from 'expo-av'

export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string};
    const {data:pokemon } = useFetchQuery("/pokemon/[id]", {id: params.id});
    const id = parseInt(params.id, 10)
    const {data:species } = useFetchQuery("/pokemon-species/[id]", {id: params.id});
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries?.find(({language}) =>  language.name == 'en')
        ?.flavor_text.replaceAll("\n", ". ");
    const stats = pokemon?.stats ?? basePokemonStats

    const onImagePress = async () => {
        const cry = pokemon?.cries.latest;
        if(!cry){
            return;
        }
         const {sound} = await Audio.Sound.createAsync({
            uri: cry
        }, { shouldPlay: true })
        sound.playAsync()
    }

    const onPrevious = () => {
        router.replace({pathname: '/pokemon/[id]', params: { id: Math.max(id - 1, 1)}})
    }

    const onNext = () => {
        router.replace({pathname: '/pokemon/[id]', params: { id: Math.min(id - 1, 151)}})
    }
    const isFirst = id == 1;
    const isLast = id == 151;

  return (
    <RouteView backgroundColor={colorType}>
        <View>
            <Image source={require('@/assets/images/pokeball_big.png')} style={styles.pokeball} height={208} width={208}></Image>
            <Row style={styles.header}>
                <Pressable onPress={router.back}>
                <Row gap={8}>
                    <Image 
                        source={require('@/assets/images/arrow_back.png')} 
                        width={32} 
                        height={32}
                        />
                    <ThemedText color='grayWhite' variant='headline' style={{textTransform:'capitalize'}}>
                        {pokemon?.name}
                    </ThemedText>
                </Row>
                </Pressable>
                <ThemedText color='grayWhite' variant='subtitle2'>#{params.id.padStart(3, '0')}</ThemedText>
            </Row>
  
                
            <Card style={styles.card}>
                        
                <Row style={styles.imageRow}>
                    { isFirst ? 
                        (<View style={{width:24, height:24}}></View>) 
                        : 
                    (<Pressable onPress={onPrevious}>
                        <Image source={require('@/assets/images/previous.png')} width={24} height={24}/>
                    </Pressable>)}
                    <Pressable onPress={onImagePress}>
                        <Image style={styles.artwork} source={{ uri: getPokemonArtwork(params.id)}} 
                            height={200}
                            width={200}
                        />
                    </Pressable>
                    { isLast ? (<View style={{width:24, height:24}}></View>): 
                    (<Pressable onPress={onNext}>
                        <Image source={require('@/assets/images/next.png')} width={24} height={24}/>
                    </Pressable>)}
                </Row>
                <Row  gap={16} style={{height:20}}>
                    {types.map(type => (
                        <PokemonType name={type.type.name} key={type.type.name}/>
                    ))}
                </Row>
                {/* About */}

                <ThemedText variant='subtitle1' style={{color: colorType}}>About</ThemedText>
                <Row>
                    <PokemonSpec style={{borderStyle:'solid', borderRightWidth:1 , borderColor:colors.grayLight}} title={formatWeight(pokemon?.weight)} description={'Weight'} image={require('@/assets/images/weight.png')}/>
                    <PokemonSpec style={{borderStyle:'solid', borderRightWidth:1 , borderColor:colors.grayLight}} title={formatWeight(pokemon?.height)} description={'Size'} image={require('@/assets/images/straighten.png')}/>
                    <PokemonSpec  title={pokemon?.moves.slice(0, 2).map(m  => m.move.name).join('\n')} description={'Moves'} />
                </Row>
                <ThemedText>{bio}</ThemedText>

                {/* Stats */}
                <ThemedText variant='subtitle1' style={{color: colorType}}>Base stats</ThemedText>
                <View style={{alignSelf:'stretch'}}>
                    {stats.map( stat => <PokemonStat key={stat.stat.name} color={colorType} name={stat.stat.name} value={stat.base_stat}></PokemonStat>)}
                </View>
            </Card>

        </View>
    </RouteView>
  )
}

const styles = StyleSheet.create({
    header: {
        margin:20,
        justifyContent: "space-between",
    },
    pokeball: {
        opacity: .1,
        position: 'absolute',
        right:8,
        top:8
    },
    imageRow: {
        position:'absolute',
        top:-140,
        zIndex: 2,
        justifyContent: "space-between",
        left:0,
        right:0,
        paddingHorizontal:20
    },
    artwork: {},
    card: {
        marginTop:144,
        paddingHorizontal:20,
        paddingTop: 60,
        paddingBottom:20,
        gap:16,
        alignItems:'center',
        
    },
    
})