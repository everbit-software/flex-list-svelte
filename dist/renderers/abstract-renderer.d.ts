import { ListItem } from "../list-item";
export interface RendererConfig {
    containerElement: HTMLElement;
    style?: ListStyle;
    paginationElements?: PaginationElements;
    loaderHtml?: string;
}
export interface ListStyle {
}
export interface PaginationElements {
    prevButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    pagesContainer: HTMLElement;
}
export declare abstract class AbstractRenderer {
    protected containerElement: HTMLElement;
    protected spinnerElement?: HTMLElement;
    paginationElements?: PaginationElements;
    searchElement?: HTMLInputElement;
    protected loaderHtml: string;
    protected style: ListStyle;
    protected constructor(config: RendererConfig);
    /**
     * Create the DOM structure
     */
    abstract setup(): void;
    /**
     * Generate an element from an item
     *
     * @param item
     */
    abstract createItemElement(item: ListItem): HTMLElement;
    abstract addItemToContainer(item: ListItem): void;
    abstract clearItems(): void;
    /**
     * Create the DOM for the spinner, if needed
     */
    abstract setupSpinner(): void;
    /**
     * Toggle the spinner
     *
     * @param show
     */
    abstract toggleSpinner(show: boolean): void;
    /**
     * Show a spinner on a given row
     *
     * @param item
     */
    abstract showItemSpinner(item: ListItem): void;
    abstract displayMessage(message: string, errorOccured: boolean): void;
    scrollIntoView(): void;
}
