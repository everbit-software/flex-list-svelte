import { writable } from "svelte/store";
import type { SearchConfig } from "./interfaces/config";

export class Search {
    /*
     * Config
     */

    // The time (in milliseconds) to wait with no user input before searching
    public readonly searchDelay: number = 400;
    
    /*
     * Dynamic
     */

    // Current query
    public query = writable(null as string|null);

    public searchTimer;

    constructor(config: SearchConfig = {}) {
        this.searchDelay = config.searchDelay ?? 400;
    }
}