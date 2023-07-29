import { ListItem } from "./list-item";
import { AbstractRenderer } from "./renderers/abstract-renderer";
import { Search } from "./search";
export interface ListConfig {
    renderer: AbstractRenderer;
    search?: Search;
    idField: string;
    noItemsText?: string;
    sortColumn?: string;
    sortDirection?: string;
    perPage?: number;
    itemCallbacks: ItemCallbacks;
}
export interface ItemCallbacks {
    load?: (page: number, limit: number) => Promise<object[]> | false;
    search?: (query: string, page: number, limit: number) => Promise<object[]> | false;
    loadOne?: (id: string | number) => Promise<object> | false;
    getLastPageNumber?: () => Promise<number> | false;
}
export interface Pagination {
    perPage: number;
    current: number;
    min: number;
    max: number | null;
    activePageRange: number | null;
}
export interface ListEvent {
    (options: object, listInstance: FlexList): void;
}
declare class FlexList {
    protected renderer: AbstractRenderer;
    protected searcher?: Search;
    private readonly idField;
    private sortColumn;
    private sortDirection;
    private noItemsText;
    private events;
    private itemCallbacks;
    private items;
    private currentSearchItems;
    private pages;
    pagination: Pagination;
    private errorOccured;
    private url;
    constructor(config: ListConfig);
    getItem(id: string | number): ListItem | undefined;
    /**
     * Get the items on a given page
     *
     * @param page
     */
    getPageItems(page: number): Promise<ListItem[]>;
    /**
     * The items currently being displayed on the page
     */
    getCurrentItems(): ListItem[];
    /**
     * Clear the items being displayed
     */
    clearCurrentItems(): void;
    private pullPageItems;
    /**
     * Search using the remote search callback
     *
     * @param query
     * @param page
     * @private
     */
    private getcurrentSearchItems;
    /**
     *
     * @param items
     * @param append Whether to add to existing or overwrite
     * @private
     */
    private renderItems;
    /**
     * Refresh an item element by item ID or item object
     *
     * @param item
     * @returns {Promise<void>}
     */
    refreshItem(item: ListItem | string | number): Promise<void>;
    /**
     * Change the page from a page number (this includes search queries)
     *
     * @param page
     * @param showSpinner
     */
    changePage(page: number, showSpinner?: boolean): Promise<void>;
    clearSearch(): Promise<void>;
    search(query: string): Promise<void>;
    /**
     * Deletes all remotes data and retrieves the current page
     */
    clearData(): Promise<void>;
    private updateUrl;
    private getQueryParam;
    private hasQueryParam;
    private setQueryParam;
    private deleteQueryParam;
    previous(): void;
    next(): void;
    private updatePagination;
    changeRenderer(renderer: AbstractRenderer): void;
    /**
     * Trigger an event
     *
     * @param eventName
     * @param data
     * @private
     */
    private triggerEvent;
    /**
     * Add an event
     *
     * @param eventName
     * @param callback
     * @private
     */
    addEventListener(eventName: any, callback: ListEvent): void;
    private init;
}
export default FlexList;
