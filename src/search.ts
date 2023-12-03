import { writable } from "svelte/store";

interface SearchConfig {
    fields: string[];
    searchDelay?: number;
}

export class Search {
    /*
     * Config
     */

    // Fields to search within
    public readonly fields: string[];

    // The time (in milliseconds) to wait with no user input before searching
    public readonly searchDelay: number = 400;
    
    /*
     * Dynamic
     */

    // Current query
    public query = writable(null as string|null);

    public searchTimer;

    constructor(config: SearchConfig) {
        this.fields = config.fields;
        this.searchDelay = config.searchDelay ?? 400;
    }
}