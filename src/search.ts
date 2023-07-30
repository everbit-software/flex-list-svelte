interface SearchConfig {
    inputElement: HTMLInputElement;
    fields: string[];
    queryParam?: string;
    searchDelay?: number;
}

export class Search {
    /*
     * Config
     */

    // Input element
    public readonly inputElement: HTMLInputElement;

    // Fields to search within
    public readonly fields: string[];

    // The search parameter to use for the search
    public readonly queryParam: string = 'q';

    // The time (in milliseconds) to wait with no user input before searching
    public readonly searchDelay: number = 200
    
    /*
     * Dynamic
     */

    // Current query
    public query: string|null = null;

    constructor(config: SearchConfig) {
        this.inputElement = config.inputElement;
        this.fields = config.fields;
        this.queryParam = config.queryParam ?? 'q';
        this.searchDelay = config.searchDelay ?? 200;
    }
}