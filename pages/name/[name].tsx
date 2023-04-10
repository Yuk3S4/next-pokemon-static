import { useEffect, useState } from 'react'

import { GetStaticProps, NextPage, GetStaticPaths } from 'next'
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react'

import confetti from 'canvas-confetti'

import { Layout } from '../../components/layouts'
import { pokeApi } from '../../api'
import { Pokemon, PokemonListResponse } from '../../interfaces'
import { getPokemonInfo, localFavorites } from '../../utils'

interface Props {
    pokemon: Pokemon
}

const PokemonByNamePage: NextPage<Props> = ({ pokemon }) => {

    const [isInFavorites, setIsInFavorites] = useState( false)
    
    const onToggleFavorite = () => {
        localFavorites.toggleFavorite( pokemon.id )
        setIsInFavorites( !isInFavorites )

        if ( isInFavorites ) return

        confetti({
            zIndex: 999,
            particleCount: 100,
            spread: 160,
            angle: -100,
            origin: {
                x: 1,
                y: 0
            }
        })
    }

    useEffect(() => {
        setIsInFavorites( localFavorites.existInfavorites( pokemon.id ) )
    }, [pokemon.id])     

    return (
        <Layout title={ pokemon.name }>
            <Grid.Container css={{ marginTop: '5px' }} gap={ 2 }>
                <Grid xs={ 12 } sm={ 4 } >
                    <Card isHoverable css={{ padding: '30px' }}>
                        <Card.Body>
                            <Card.Image 
                                src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
                                alt={ pokemon.name }
                                width="100%"
                                height={ 200 }
                            />
                        </Card.Body>
                    </Card>
                </Grid>

                <Grid xs={ 12 } sm={ 8 }>
                    <Card>
                        <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text h1 transform='capitalize'>{ pokemon.name }</Text>

                            <Button
                                color="gradient"
                                ghost={ !isInFavorites }
                                onPress={ onToggleFavorite }
                            >
                                { isInFavorites ? 'En favoritos' : 'Guardar en favoritos' }
                            </Button>
                        </Card.Header>       

                        <Card.Body>
                            <Text size={ 30 }>Sprites:</Text>

                            <Container direction='row' display='flex' gap={ 0 }>
                                <Image 
                                    src={ pokemon.sprites.front_default }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />  
                                <Image 
                                    src={ pokemon.sprites.back_default }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />  
                                <Image 
                                    src={ pokemon.sprites.front_shiny }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />  
                                <Image 
                                    src={ pokemon.sprites.back_shiny }
                                    alt={ pokemon.name }
                                    width={ 100 }
                                    height={ 100 }
                                />  
                            </Container>    
                        </Card.Body>                 
                    </Card>
                </Grid>

            </Grid.Container>
        </Layout>
    )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
// Generacion de todos los argumentos dinámicos que getStaticProps podrá recibir
export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151')
    const pokemonNames: string[] = data.results.map( p => p.name)    

    return {
        paths: pokemonNames.map( name => ({
            params: { name } // los params los recibirá por defecto getStaticProps()
        })),
        // Si la persona pone un url que no existe en paths, da un 404
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => { // se ejecuta del lado del servidor y solo en buildtime, sólo se usa en pages. En producción sólo se ejecuta una única vez. Se genera la info antes de que cargue la página
  
    const { name } = params as { name: string }
  
    return {
      props: { // props - se mandan a las props del componente
        pokemon: await getPokemonInfo( name )
      }
    }
}

export default PokemonByNamePage