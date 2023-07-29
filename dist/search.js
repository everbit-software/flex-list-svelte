export class Search {
    /*
     * Config
     */
    // Input element
    inputElement;
    // Fields to search within
    fields;
    // The search parameter to use for the search
    queryParam = 'q';
    // The time (in milliseconds) to wait with no user input before searching
    searchDelay = 200;
    /*
     * Dynamic
     */
    // Current query
    query = null;
    constructor(config) {
        this.inputElement = config.inputElement;
        this.fields = config.fields;
        this.queryParam = config.queryParam ?? 'q';
        this.searchDelay = config.searchDelay ?? 200;
    }
}
//# sourceMappingURL=search.js.map