import { get, writable } from "svelte/store";
import { ListItem } from "./list-item";
import type { Search } from "./search";

export interface ListConfig {
    search?: Search;

    idField: string;

    sortColumn?: string
    sortDirection?: string
    perPage?: number
    itemCallbacks: ItemCallbacks
}

export interface ItemCallbacks {
    // On page load
    load?: (page: number, limit: number) => Promise<object[] | false>;

    // On search
    search?: (query: string, page: number, limit: number) => Promise<object[] | false>;

    // Load one item
    loadOne?: (id: string | number) => Promise<object | false>;

    // Get the last page number (for pagination)
    getLastPageNumber?: () => Promise<number | false>;
}

export interface Pagination {
    // Show pagination
    visible: boolean;

    // Items per page
    perPage: number;

    // The currently displayed page
    current: number;

    // Minimum page number to display
    min: number;

    // Maximum page number to display
    max: number | null;

    // The number of pages to show either side of the current page
    activePageRange: number | null;

    // The pages that can be clicked currently
    inbetweenPages: number[];

    // Show first page button
    firstPageButtonVisible: boolean;

    // Show end page button
    lastPageButtonVisible: boolean;
}

export interface ListEvent {
    (options: object, listInstance: FlexList): void;
}

class FlexList {
    public searcher?: Search;

    /*
     * Configuration (ID field, search config, columns, and sort)
     */

    // How the row is identified
    private readonly idField: string;

    // Sorting column
    private sortColumn: string | null = null;

    // Sorting direction
    private sortDirection = 'asc';

    /*
     * Available events
     *
     * itemsRendered    After an item has been rendered
     * pageChanged      After a page change
     * initialised      After the list is initialised
     */
    private events: object = [];

    /*
     * Callbacks used to get list data
     */
    private itemCallbacks: ItemCallbacks = {};

    /*
     * Items
     */

    // Items (no search)
    private items: ListItem[] = [];

    // Current items in the search
    private currentSearchItems: ListItem[] | null = null;

    // The pages that have been pulled so far
    private pages: Array<string | number> = [];

    /*
     * Stateful changes
     */

    // Items currently being displayed
    public displayedItems = writable([] as ListItem[]);

    // Message to dispalay if there is an error
    public displayedMessage = writable(null as string|null);

    // Show spinner
    public showSpinner = writable(false);

    public pagination = writable({
        // Show pagination
        visible: true,

        // Items per page
        perPage: 10,

        // The currently displayed page
        current: 1,

        // Minimum page number to display
        min: 1,

        // Maximum page number to display
        max: null,

        // The number of pages to show either side of the current page
        activePageRange: 1,

        // Inbetween pages
        inbetweenPages: [],

        // Jump to first page button
        firstPageButtonVisible: false,
        
        // Jump to last page button
        lastPageButtonVisible: false
    } as Pagination)

    // Whether there is an error or not
    private errorOccured = false;

    // The page URL (to update the query parameters
    private url: URL;

    constructor(config: ListConfig) {
        this.idField = config.idField;
        this.sortColumn = config.sortColumn ?? null;
        this.sortDirection = (config.sortDirection ?? 'asc').toLowerCase();
        this.searcher = config.search;

        // Pagination
        this.pagination.update((p) => {
            p.perPage = config.perPage ?? 10
            return p;
        });

        this.itemCallbacks = config.itemCallbacks;

        this.init().then();
    }

    public getItem(id: string | number): ListItem | undefined {
        const matchingItems = this.items.filter((item: ListItem) => item.id === id);

        return matchingItems.length > 0 ? matchingItems.at(0) : undefined;
    }

    /**
     * Get the items on a given page
     *
     * @param page
     */
    public async getPageItems(page: number): Promise<ListItem[]> {
        if (!this.pages.includes(page)) {
            await this.pullPageItems(page);
        }

        return this.items.filter((item: ListItem) => item.page === page);
    }

    /**
     * The items currently being displayed on the page
     */
    public getCurrentItems(): ListItem[] {
        if (this.searcher && get(this.searcher.query)) {
            return this.currentSearchItems ?? [];
        } else {
            return get(this.displayedItems);
        }
    }

    private async pullPageItems(page: number, refreshIfExists: boolean = false) {
        // Pull a page, if the page hasn't been already
        if (!this.pages.includes(page) || refreshIfExists) {
            if (!this.pages.includes(page)) {
                this.pages.push(page);
            }

            let itemsObjects: any;

            itemsObjects = await this.itemCallbacks.load(page, get(this.pagination).perPage);

            if (itemsObjects === false) {
                this.displayedMessage.set('Data was unable to be retrieved, reload the page to try again.');
                return;
            }

            if (itemsObjects.length < get(this.pagination).perPage) {
                this.pagination.update((p) => {
                    p.max = page;
                    return p;
                });
            }

            for (let itemData of itemsObjects) {
                const id = itemData[this.idField];

                let item = this.getItem(id);

                // Just update the page if the item has already been added
                if (item !== undefined && (item.page === null || refreshIfExists)) {
                    // Update information
                    item.page = page;
                    item.data = itemData;
                } else {
                    item = new ListItem(itemData, id, page);

                    this.items.push(item);
                }
            }
        }

        if (this.errorOccured) {
            return;
        }
    }

    /**
     * Search using the remote search callback
     *
     * @param query
     * @param page
     * @private
     */
    private async getcurrentSearchItems(query: string, page: number): Promise<ListItem[]> {
        // Search by remote values
        let itemObjects = await this.itemCallbacks.search(query, get(this.pagination).current, get(this.pagination).perPage);

        if (itemObjects === false) {
            this.displayedMessage.set('Your search returned an error, please try again');
            return [];
        }

        let items: ListItem[] = [];

        for (let itemData of itemObjects) {
            items.push(new ListItem(itemData, itemData[this.idField], page));
        }

        return items;
    }

    /**
     * Change the page from a page number (this includes search queries)
     *
     * @param page
     * @param showSpinner
     */
    public async changePage(page: number, showSpinner: boolean = true) {
        this.displayedMessage.set(null);
        
        // Update the page to be in the correct bounds
        if (get(this.pagination).max && page > get(this.pagination).max) {
            page = get(this.pagination).max;
        } else if (page < get(this.pagination).min) {
            page = get(this.pagination).min;
        }

        // Get the page change type
        let pageChange = 'refresh-only';

        if (get(this.pagination).current < page) {
            pageChange = 'next'
        } else if (get(this.pagination).current > page) {
            pageChange = 'prev';
        }

        // Show spinner
        if (showSpinner) {
            this.showSpinner.set(true);
        }

        // Get previous page
        let previousPage = get(this.pagination).current;
        this.pagination.update((p) => {
            p.current = page;
            return p;
        });

        let pageItems: ListItem[];

        if (this.searcher && get(this.searcher.query)) {
            pageItems = await this.getcurrentSearchItems(get(this.searcher.query), page);
            this.currentSearchItems = pageItems;
        } else {
            pageItems = await this.getPageItems(page);
            this.currentSearchItems = null;
        }

        // Return if there is an error getting items
        if (this.errorOccured) {
            return;
        }

        // If no items, go to previous page (if it's not the same page as that would an infinite loop)
        if (pageItems.length === 0 && previousPage !== page && get(this.pagination).current !== 1) {
            if (pageChange === 'next') {
                this.pagination.update((p) => {
                    p.max = previousPage;
                    return p;
                });
            }

            this.changePage(previousPage).then();
            return;
        }

        // Order items
        if (this.sortColumn !== null) {
            pageItems = pageItems.sort((a, b) => {
                return a.data[this.sortColumn].toString().localeCompare(b.data[this.sortColumn].toString());
            });

            if (this.sortDirection !== 'asc') {
                pageItems.reverse();
            }
        }

        if (showSpinner) {
            this.showSpinner.set(false);
        }

        if (pageItems.length === 0) {
            if (this.searcher && get(this.searcher.query)) {
                this.displayedMessage.set(`No results found for <span class="badge bg-light ms-1">${get(this.searcher.query)}</span>`);
            } else {
                this.displayedMessage.set(this.noItemsText);
            }
        }

        this.displayedItems.set(pageItems);

        // this.renderer.scrollIntoView();

        this.updatePagination();

        this.triggerEvent(this.searcher && get(this.searcher.query) ? 'search' : 'pageChanged', {
            page: page,
            pageItems: pageItems,
            query: !this.searcher ? null : get(this.searcher?.query),
            changeType: pageChange
        });
    }

    public async clearSearch() {
        if (!this.searcher) {
            return;
        }

        this.showSpinner.set(false);
        this.searcher.query.set(null);

        await this.changePage(1);
    }

    public async search(query: string) {
        if (!this.searcher || get(this.searcher.query) === query) {
            this.showSpinner.set(false);
            return;
        }

        this.pagination.update((p) => {
            p.current = 1;
            return p;
        });

        this.searcher.query.set(query);

        if (!query) {
            await this.clearSearch();
            return;
        }

        await this.changePage(get(this.pagination).current, false);

        this.showSpinner.set(false);
    }

    public async bindSearch(value: string|null) {
        this.showSpinner.set(true);

        clearTimeout(this.searcher.searchTimer);
        this.searcher.searchTimer = setTimeout(() => this.searcher && this.search(value), this.searcher?.searchDelay);
    }

    /**
     * Deletes all remotes data and retrieves the current page
     */
    public async clearData() {
        this.items = [];
        this.pages = [];
        await this.changePage(get(this.pagination).current);
    }

    private updateUrl() {
        let url = this.url.toString()

        window.history.pushState({ path: url }, '', url);
    }

    public previous() {
        let newPage = get(this.pagination).current - 1;

        if (newPage < get(this.pagination).min) {
            newPage = get(this.pagination).min;
        }

        this.changePage(newPage).then();
    };

    public next() {
        let newPage = get(this.pagination).current + 1;

        if (get(this.pagination).max !== null && newPage > get(this.pagination).max) {
            newPage = get(this.pagination).max;
        }

        this.changePage(newPage).then();
    };

    private updatePagination() {
        let inBetweenPages: number[] = [];
        let showPagination = true;

        const { min, max, activePageRange, current } = get(this.pagination);

        if (this.getCurrentItems().length === 0) {
            showPagination = false;
        } else if (min && max && Math.abs(max - min) <= 5) {
            // If there are less than 5 pages
            for (let p = min; p <= max; p++) {
                inBetweenPages.push(p);
            }
        } else if (min && current <= min + activePageRange) {
            // First few pages
            for (let p = min; p <= min + (activePageRange * 2); p++) {
                inBetweenPages.push(p);
            }
        } else if (max && current >= max - activePageRange) {
            // Last few pages
            for (let p = max - (activePageRange * 2); p <= max; p++) {
                inBetweenPages.push(p);
            }
        } else if (min && max) {
            // Middle pages (if known max)
            for (let p = current - activePageRange; p <= current + activePageRange && min <= p && p <= max; p++) {
                inBetweenPages.push(p);
            }
        } else {
            // Middle pages (if max is not known)
            for (let p = current - activePageRange; p <= current + activePageRange && min <= p; p++) {
                inBetweenPages.push(p);
            }
        }

        // Update pagination
        this.pagination.update((p) => {
            p.visible = showPagination;
            p.inbetweenPages = inBetweenPages;
            p.firstPageButtonVisible = showPagination && min && !inBetweenPages.includes(min);
            p.lastPageButtonVisible = showPagination && max && !inBetweenPages.includes(max);

            return p;
        });
    }

    /**
     * Trigger an event
     *
     * @param eventName
     * @param data
     * @private
     */
    private triggerEvent(eventName: string, data: object = {}) {
        const events = this.events[eventName] ?? [];

        for (const evt of events) {
            evt(data, this);
        }
    }

    /**
     * Add an event
     *
     * @param eventName
     * @param callback
     * @private
     */
    public addEventListener(eventName, callback: ListEvent) {
        if (this.events[eventName] === undefined) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    private async initPagination() {
        // Get the last page number
        if (this.itemCallbacks.getLastPageNumber !== undefined) {
            const lastPage = await this.itemCallbacks.getLastPageNumber();

            if (lastPage !== false) {
                this.pagination.update(p => {
                    p.max = lastPage;
                    return p;
                })
            }
        }
    }

    public setLastPage(lastPage: number|null) {
        this.pagination.update(p => {
            p.max = lastPage;
            return p;
        })
    }

    private async init() {
        // Get query parameters
        this.url = new URL(window.location.href)

        // Add spinner
        this.showSpinner.set(true);

        // Render init items
        this.changePage(get(this.pagination).current).then(async () => {
            this.showSpinner.set(false);

            // If no items, change to the first page
            if (this.getCurrentItems().length === 0) {
                await this.changePage(get(this.pagination).min);
            }
        });

        await this.initPagination();

        this.triggerEvent('initialised');
    }
}

export default FlexList;