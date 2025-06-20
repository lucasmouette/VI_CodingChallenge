// Code written by Lucas Mouette

import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { getAllPokemon, getPokemonByFilter } from "../services/PokeAPI";
import type { Pokemon } from "../models/PokemonProps";
import "./PokeCard";

@customElement('poke-list')
export class PokeList extends LitElement {

    @state() private pokemonList: Pokemon[] = [];
    @state() private filteredPokemonList: Pokemon[] = [];
    @state() private loading = false;
    @state() private error = "";

    static styles = css`
        :host {
            display: block;
            padding: 2rem;
        }

        .container {
            display: flex;
            gap: 2rem;
            align-items: flex-start;
        }

        .filter-sidebar {
            width: 250px;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 1.5rem;
            background: white;
            height: fit-content;
        }

        .filter-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }

        .filter-section {
            margin-bottom: 1.5rem;
        }

        .filter-section h3 {
            margin: 0 0 0.75rem 0;
            font-size: 1rem;
            color: #333;
        }

        .filter-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }

        .filter-option input[type="checkbox"] {
            width: 16px;
            height: 16px;
        }

        .filter-option label {
            color: #333;
            cursor: pointer;
        }

        .type-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #333;
        }

        .type-normal { background: #A8A77A; }
        .type-fighting { background: #C22E28; }
        .type-flying { background: #A98FF3; }
        .type-poison { background: #A33EA1; }
        .type-ground { background: #E2BF65; }
        .type-rock { background: #B6A136; }
        .type-bug { background: #A6B91A; }
        .type-ghost { background: #735797; }
        .type-steel { background: #B7B7CE; }
        .type-fire { background: #EE8130; }
        .type-water { background: #6390F0; }
        .type-grass { background: #7AC74C; }
        .type-electric { background: #F7D02C; }
        .type-psychic { background: #F95587; }
        .type-ice { background: #96D9D6; }
        .type-dragon { background: #6F35FC; }
        .type-dark { background: #705746; }
        .type-fairy { background: #D685AD; }

        .main-content {
            flex: 1;
        }

        .pokemon-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }

        .loading, .error {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
        }
        
        .error {
            color: red;
        }
    `

    async connectedCallback() {
        super.connectedCallback()
        await this.loadPokemon()
    }

    async loadPokemon() {
        this.loading = true;
        this.error = "";

        try {
            const data = await getAllPokemon();
            if (data && data.results) {
                this.pokemonList = data.results;
                this.filteredPokemonList = this.pokemonList;
            } else {
                this.error = "Failed to load Pokemon";
            }
        } catch (err){
            this.error = "Error loading Pokemon";
            console.error("Error: ", err)
        } finally {
            this.loading = false;
        }
    }

    private async handleTypeFilter(e: Event) {
        const checkbox = e.target as HTMLInputElement;
        const type = checkbox.value;
        
        const allCheckboxes = this.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
        allCheckboxes.forEach(cb => cb.checked = false);
        
        checkbox.checked = true;

        this.loading = true;
        try {
            const typeData = await getPokemonByFilter(type);
            if (typeData && typeData.pokemon) {
                const typePokemon = typeData.pokemon.map((p: any) => p.pokemon);
                this.filteredPokemonList = typePokemon.slice(0, 20);
            }
        } catch (err) {
            console.error('Filter error:', err);
        } finally {
            this.loading = false;
        }
    }

    render() {

        if(this.loading) {
            return html`<div class="loading">Loading Pokemon...</div>`;
        }

        if(this.error) {
            return html`<div class="error">${this.error}</div>`;
        }

        return html`
            <div class="title">These are our products</div>

            <div class="container">
                <div class="filter-sidebar">
                    <div class="filter-title">Filter</div>
                    
                    <div class="filter-section">
                        <h3>Type</h3>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="normal" value="normal" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-normal"></div>
                            <label for="normal">Normal</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="fire" value="fire" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-fire"></div>
                            <label for="fire">Fire</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="water" value="water" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-water"></div>
                            <label for="water">Water</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="electric" value="electric" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-electric"></div>
                            <label for="electric">Electric</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="grass" value="grass" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-grass"></div>
                            <label for="grass">Grass</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="ice" value="ice" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-ice"></div>
                            <label for="ice">Ice</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="fighting" value="fighting" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-fighting"></div>
                            <label for="fighting">Fighting</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="poison" value="poison" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-poison"></div>
                            <label for="poison">Poison</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="ground" value="ground" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-ground"></div>
                            <label for="ground">Ground</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="flying" value="flying" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-flying"></div>
                            <label for="flying">Flying</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="psychic" value="psychic" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-psychic"></div>
                            <label for="psychic">Psychic</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="bug" value="bug" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-bug"></div>
                            <label for="bug">Bug</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="rock" value="rock" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-rock"></div>
                            <label for="rock">Rock</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="ghost" value="ghost" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-ghost"></div>
                            <label for="ghost">Ghost</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="dragon" value="dragon" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-dragon"></div>
                            <label for="dragon">Dragon</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="dark" value="dark" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-dark"></div>
                            <label for="dark">Dark</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="steel" value="steel" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-steel"></div>
                            <label for="steel">Steel</label>
                        </div>
                        
                        <div class="filter-option">
                            <input type="checkbox" id="fairy" value="fairy" @change=${this.handleTypeFilter}>
                            <div class="type-indicator type-fairy"></div>
                            <label for="fairy">Fairy</label>
                        </div>
                    </div>
                </div>

                <div class="main-content">
                    <div class="pokemon-grid">
                        ${this.filteredPokemonList.map((pokemon: Pokemon) => html`
                            <poke-card
                                name=${pokemon.name}
                                url=${pokemon.url}>
                            </poke-card>
                            `)}
                    </div>
                </div>
            </div>
            `;
    }
}