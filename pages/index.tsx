import { NextPage, GetStaticProps } from 'next'
import { Grid } from '@nextui-org/react';

import { pokeApi } from '../api';
import { PokemonListResponse, SmallPokemon } from '../interfaces';
import { Layout } from '../components/layouts'
import { PokemonCard } from '../components/pokemon';

interface Props {
  pokemons: SmallPokemon[]
}

// title: Listado de pokemons
const HomePage: NextPage<Props> = ({ pokemons }) => {

  return (
    <Layout title="Listado de Pokémons">
      <Grid.Container gap={ 2 } justify='flex-start'>
        { pokemons.map( poke => (
          <PokemonCard key={ poke.id } pokemon={ poke } />
        )) }
      </Grid.Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => { // se ejecuta del lado del servidor y solo en buildtime, sólo se usa en pages. En producción sólo se ejecuta una única vez. Se genera la info antes de que cargue la página
  
  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151')  
  
  const pokemons: SmallPokemon[] = data.results.map( (poke, i) => {
    return {
      ...poke,
      id: i + 1,
      img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${ i + 1 }.svg`
    }
  })  

  return {
    props: { // props - se mandan a las props del componente
      pokemons
    }
  }
}

export default HomePage
