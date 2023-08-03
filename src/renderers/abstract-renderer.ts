import { ListItem } from "../list-item";

export interface RendererConfig {
    containerElement: HTMLElement;
    style?: ListStyle;
    paginationElements?: PaginationElements;
    loaderHtml?: string;
}

export interface PaginationStyle {
    pageClasses?: string[];
    pageSelectedClasses?: string[];
    pageDeselectedClasses?: string[];
    pagesContainerClasses?: string[];
}

export interface ListStyle {
    paginationStyle?: PaginationStyle;
}

export interface PaginationElements {
    prevButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    pagesContainer: HTMLElement;
}

export abstract class AbstractRenderer {
    // Outer container
    protected containerElement: HTMLElement;

    // Spinner element
    protected spinnerElement?: HTMLElement;

    // Pagination
    public paginationElements?: PaginationElements;

    // Element for search
    public searchElement?: HTMLInputElement;

    // The HTML for the loader, this will be shown when getting data
    // By default this is just 'Loading...'
    protected loaderHtml = 'Loading...';

    public style: ListStyle = {
        paginationStyle: {
            pageClasses: ['btn'],
            pageSelectedClasses: ['btn-secondary'],
            pageDeselectedClasses: ['btn-secondary-outline'],
            pagesContainerClasses: ['input-group']
        }
    };

    protected constructor(config: RendererConfig) {
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
     * Initial setup
     */

    /**
     * Create the DOM structure
     */
    public abstract setup(): void;

    /*
     * Rendering
     */

    /**
     * Generate an element from an item
     *
     * @param item
     */
    public abstract createItemElement(item: ListItem): HTMLElement;

    public abstract addItemToContainer(item: ListItem): void;

    public abstract clearItems(): void;

    /*
     * Spinner
     */

    /**
     * Create the DOM for the spinner, if needed
     */
    public abstract setupSpinner(): void;

    /**
     * Toggle the spinner
     *
     * @param show
     */
    public abstract toggleSpinner(show: boolean): void;

    /**
     * Show a spinner on a given row
     *
     * @param item
     */
    public abstract showItemSpinner(item: ListItem): void;

    /*
     * Messages (and errors)
     */

    public abstract displayMessage(message: string, errorOccured: boolean): void;

    /*
     * General
     */

    public scrollIntoView() {
        this.containerElement.scrollIntoView();
    }
}