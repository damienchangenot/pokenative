import Card from "@/components/Card";
import PokemonCard from "@/components/pokemon/PokemonCard";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import useThemeColors from "@/hooks/useThemeColors";
import { ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";
import { Row } from "@/components/Row";
import { SortButton } from "@/components/SortButton";
import { RouteView } from "@/components/RouteView";
export default function Index() {
    const colors = useThemeColors()
    const [sortKey, setSortKey] = useState<"id" | "name">("id");
    const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21')
    const pokemons = data?.pages.flatMap(page => page.results.map( r => ({name: r.name, id: getPokemonId(r.url)}))) ?? []
    const [search, setSearch] = useState('');

    const filteredPokemons = [...(search 
        ? pokemons.filter( 
            p => p.name.includes(search.toLowerCase()) || 
            p.id.toString() == search
        ) 
        : pokemons)].sort((a , b) => (a[sortKey] < b[sortKey] ? -1 : 1));
    return (
        <RouteView>
        <Row style={styles.header} gap={16}>
            <Image source={require('@/assets/images/pokeball.png')} width={24} height={24}/>
            <ThemedText variant="headline" color="grayLight">Pokedex</ThemedText>
        </Row>
        <Row gap={16} style={styles.form}>
            <SearchBar value={search} onChange={setSearch}/>
            <SortButton value={sortKey} onChange={setSortKey}/>
        </Row>
        <Card style={styles.body}>
            <FlatList 
                    data={filteredPokemons} 
                    numColumns={3}
                    columnWrapperStyle={styles.gridGap}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    renderItem={({item}) => <PokemonCard id={item.id} name={item.name} style={{flex: 1/3}}/>}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={ search ? undefined :() => fetchNextPage()}
                    ListFooterComponent={
                        isFetching ? <ActivityIndicator color={colors.tint}/> : null
                    }/>
        </Card>
        </RouteView>
    );
}
const styles = StyleSheet.create({

  header: {
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  body: {
    flex: 1,
    marginTop: 16
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding : 12
  },
  form: {
    paddingHorizontal:12
  }
})