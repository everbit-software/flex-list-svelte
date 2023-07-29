interface SearchConfig {
    inputElement: HTMLInputElement;
    fields: string[];
    queryParam?: string;
    searchDelay?: number;
}
export declare class Search {
    readonly inputElement: HTMLInputElement;
    readonly fields: string[];
    readonly queryParam: string;
    readonly searchDelay: number;
    query: string | null;
    constructor(config: SearchConfig);
}
export {};
