import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import {ApolloClient, InMemoryCache, gql} from "@apollo/client";
import {
    Heading,
    Box,
    Flex,
    Input,
    Stack,
    IconButton,
    useToast,
  } from "@chakra-ui/react";

import {SearchIcon, CloseIcon} from "@chakra-ui/icons";
import Character from "../components/Character";
import { HiBell } from 'react-icons/hi';

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = useState
  (initialState.characters);
  console.log(initialState);
  const [search, setSearch] = useState("");
  const toast = useToast();

  return (
    <Flex direction="column" justify="center"
    align="center"> 
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={4} flexDirection="column" align="center"
      justify="center" py={8}>
        <Heading as="h1" size="2x1" mb={8}>eleni{" "}
        <h3> Hello<HiBell /> </h3>
        </Heading>
        

        <form 
        onSubmit={async (event) => {
          event.preventDefault();
          const results = await fetch("/api/SearchCharacters",{
            method: "post",
            body: search,
          });
          const { characters, error } = await results.json(); 
          if(error) {
            toast({
              position: "bottom",
              title: "An error occured",
              description: error,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }else{
            setCharacters(characters);
          }
        }
        }
        >
          <Stack maxWidth="350px" width="100%" isInline mb={8}>
            <Input 
              placeholder="Search"
              value={search}
              border="none" 
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton colorScheme="blue"
              aria-label="Search Database"
              icon={<SearchIcon/>}
              disabled= {search === ""}
              type="submit"
            />
              <IconButton  colorScheme="red"
              arial-label="Reset"
              icon={< CloseIcon />}
              disabled= {search === ""}
              onClick={async () => {
                setSearch("")
                setCharacters(initialState.characters);
              }}
            />
          </Stack>
        </form>
        <Character characters={characters} />
      </Box>

      <footer className={styles.footer}>
       footer
       </footer>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "http://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const {data} = await client.query({
    query: gql`
    query{
      characters(page: 1) {
        info{
          count
          pages
        }
        results{
          name
          id
          location{
            id
            name
          }
          origin{
            id
            name
          }
          episode{
            id
            episode
            air_date
          }
          image
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },

  };
}
