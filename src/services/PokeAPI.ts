// Code written by Lucas Mouette

export async function getAllPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`)
        if (!response.ok) throw new Error("Error fetching Pokemon");
        const data = await response.json()
        return data
    } catch(error) {
        if(error instanceof Error){
            console.error("Error occurred while fetching Pokemon: ", error.message)
        } else {
            console.error("Unknown Error: ", error);
        }
        return null;
    }
}

export async function getPokemonDetails(url: string) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Error fetching Pokemon Details");
        const data = await response.json()
        return data
    } catch(error) {
        if(error instanceof Error){
            console.error("Error occurred while fetching Pokemon Details: ", error.message)
        } else {
            console.error("Unknown Error: ", error);
        }
        return null;
    }
}

export async function getPokemonByFilter(filter: string) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${filter}`)
        if (!response.ok) throw new Error("Error fetching Pokemon by Filter");
        const data = await response.json()
        return data
    } catch(error) {
        if(error instanceof Error){
            console.error("Error occurred while fetching Pokemon by Filter: ", error.message)
        } else {
            console.error("Unknown Error: ", error);
        }
        return null;
    }
}