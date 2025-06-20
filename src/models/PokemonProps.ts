// Code written by Lucas Mouette

export interface Pokemon {
    /* id?: number; */
    name: string;
    url: string;
    pokedex_number ?: string;
    type ?: string[]
}

export interface APIPokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
}