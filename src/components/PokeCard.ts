// Code written by Lucas Mouette

import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { APIPokemon, Pokemon } from "../models/PokemonProps";
import { getPokemonDetails } from "../services/PokeAPI";

export const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fighting: '#C22E28',
  flying: '#A98FF3',
  poison: '#A33EA1',
  ground: '#E2BF65',
  rock: '#B6A136',
  bug: '#A6B91A',
  ghost: '#735797',
  steel: '#B7B7CE',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  psychic: '#F95587',
  ice: '#96D9D6',
  dragon: '#6F35FC',
  dark: '#705746',
  fairy: '#D685AD',
  stellar: '#4E8DD3',
  unknown: '#A9A9A9',
};

@customElement('poke-card')
export class PokeCard extends LitElement implements Pokemon{
    @property() name = "";
    @property() url = ""

    @state() private pokemonData: APIPokemon | null = null;
    @state() private loading = false
    @state() private error = false

    static styles = css`
        :host {
            display: block;
            width: 100%; 
        }

        .card {
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            width: 180px;
            height: 220px;
            position: relative;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
        }

        .card-top {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            position: relative;
        }

        .pokedex-number {
            position: absolute;
            top: 8px;
            right: 12px;
            font-weight: bold;
            color: #333;
            font-size: 1rem;
        }

        .pokemon-image {
            width: 100px;
            height: 100px;
            object-fit: contain;
            margin-top: 1rem;
        }
        
        .card-bottom {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-top: 2px solid #333;
            padding: 0.75rem;
            text-align: center;
            background: white;
            border-radius: 0 0 6px 6px;
        }

        .pokemon-name {
            font-weight: bold;
            font-size: 1rem;
            margin: 0 0 0.5rem 0;
            text-transform: capitalize;
            color: #333;
            line-height: 1.2;
        }

        .types {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            align-items: center;
        }
        
        .type-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid #333;
        }

        .error {
            color: #f44336;
        }
    `

    updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);

        if(changedProperties.has("url") && this.url) {
            this.loadPokemonDetails();
        }
    }

    private async loadPokemonDetails() {
        if(!this.url) return;
        
        this.loading = true;
        this.error = false;

        try {
            const data = await getPokemonDetails(this.url);
            if (data) {
                this.pokemonData = data;
            } else {
                this.error = true;
            }
        } catch(err) {
            console.error("Error loading Pokemon Details: ", err)
            this.error = true;
        } finally {
            this.loading = false;
        }
    }

    render() {

        if(this.loading){
            return html`
            <div class="card">
                    <div class="loading">
                        <span>Loading...</span>
                    </div>
                </div>
            `
        }

        if(this.error){
            return html`
            <div>
                Error!
            </div>
            `
        }

        if(this.pokemonData){
            return html`
            <a href="/">
                <div class="card">
                    <div class="card-top">
                        <div class="pokedex-number">
                            #${this.pokemonData.id}
                        </div>
                            <img 
                                class="pokemon-image"
                                src="${this.pokemonData?.sprites.front_default}" 
                                alt="${this.pokemonData?.name}"
                            />
                        </div>
                    <div class="card-bottom">
                        <div class="pokemon-name">
                            ${this.pokemonData?.name}
                        </div>
                        <div class="types">
                            ${this.pokemonData?.types.map((type) =>
                            html`
                                <span
                                    class="type-dot"
                                    style="background-color: ${typeColors[type.type.name] || "#AAA"}"
                                    title=${type.type.name}
                                ></span>
                            `)}
                    </div>
                </div>
            </a>
            `;
        }

        return html`
        <div class="card">
            <div class="no-data">
                No data
            </div>
        </div>
        `
    }
}