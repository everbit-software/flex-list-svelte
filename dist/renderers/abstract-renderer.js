export class AbstractRenderer {
    // Outer container
    containerElement;
    // Spinner element
    spinnerElement;
    // Elements for pagination
    paginationElements;
    // Element for search
    searchElement;
    // The HTML for the loader, this will be shown when getting data
    // By default this is just 'Loading...'
    loaderHtml = 'Loading...';
    style;
    constructor(config) {
        this.containerElement = config.containerElement;
        this.style = config.style ?? {};
        if (config.paginationElements) {
            this.paginationElements = config.paginationElements;
        }
        if (config.loaderHtml) {
            this.loaderHtml = config.loaderHtml;
        }
    }
    /*
     * General
     */
    scrollIntoView() {
        this.containerElement.scrollIntoView();
    }
}
//# sourceMappingURL=abstract-renderer.js.map