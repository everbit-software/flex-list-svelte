import { get, writable } from "svelte/store";
import { ListItem } from "./list-item";
import type { Search } from "./search";

export interface ListConfig {
    idField: string;
    search?: Search;
    perPage?: number
    itemCallbacks?: ItemCallbacks;
    fetchCallback?: FetchCallback;
    filters?: Filter[];
}

export interface ItemCallbacks {
    // On page load
    load?: (page: number, limit: number) => Promise<object[] | false>;

    // On search
    search?: (query: string, page: number, limit: number) => Promise<object[] | false>;

    // Get the last page number (for pagination)
    getLastPageNumber?: () => Promise<number | false>;
}

export interface FetchCallbackOptions {
    page: number;
    limit: number;
    query?: string;
    filters: any[];
    flex: FlexList;
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

    // Total item count
    totalItems: number | null;

    // The number of pages to show either side of the current page
    activePageRange: number | null;

    // The pages that can be clicked currently
    inbetweenPages: number[];

    // Show first page button
    firstPageButtonVisible: boolean;

    // Show end page button
    lastPageButtonVisible: boolean;
}

export type FetchCallback = (options: FetchCallbackOptions) => Promise<object[]|false>;

export interface ListEvent {
    (options: object, listInstance: FlexList): void;
}

class FlexList {
    /*
     * Configuration (ID field, search config, columns)
     */

    // How the row is identified
    private readonly idField: string;

    public searcher?: Search;

    public filters = writable([] as Array<Filter>);

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
    private itemCallbacks?: ItemCallbacks;

    private fetchCallback: FetchCallback;


    /*
     * Stateful changes
     */

    public state = writable('loading' as 'loading'|'message'|'results');

    // Items currently being displayed
    public items = writable([] as ListItem[]);

    // Message to dispalay if there is an error
    public message = writable(null as string|null);

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

        // Total item count
        totalItems: null,

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

    constructor(config: ListConfig) {
        this.idField = config.idField;
        this.searcher = config.search;

        // Filters
        const filters = config.filters ?? [];

        for (const filter of filters) {
            filter.enabled = filter.selectedValue !== undefined;

            // Defaults
            if (filter.selectedValue !== undefined) {
                // User selected
                filter.selectedValue = filter.selectedValue ?? null;
            } else if (filter.type === 'boolean') {
                // Boolean
                filter.selectedValue = false;
            }
        }

        this.filters.set(filters);

        // Pagination
        this.pagination.update((p) => {
            p.perPage = config.perPage ?? 10
            return p;
        });

        this.itemCallbacks = config.itemCallbacks;

        if (config.fetchCallback !== undefined) {
            this.fetchCallback = config.fetchCallback;
        } else {
            this.fetchCallback = async ({ page, limit, query }) => {
                if (query === undefined) {
                    return await this.itemCallbacks.load(page, limit);
                } else {
                    return await this.itemCallbacks.search(query, page, limit);
                }
            }
        }

        this.init().then();
    }

    private displayMessage(message: string) {
        this.message.set(message);
        this.state.set('message');
    }

    private async getPageItems(page: number) {
        let itemsObjects: any;

        const hasQuery = this.searcher && get(this.searcher.query);

        let options: FetchCallbackOptions = {
            page: page, 
            limit: get(this.pagination).perPage,
            filters: get(this.filters),
            flex: this
        };

        if (hasQuery) {
            options.query = get(this.searcher.query)
        }

        itemsObjects = await this.fetchCallback(options);

        if (itemsObjects === false) {
            if (hasQuery) {
                this.displayMessage('Your search returned an error, please try again');
            } else {
                this.displayMessage('Data was unable to be retrieved, reload the page to try again.');
            }

            return;
        }

        if (itemsObjects.length < get(this.pagination).perPage) {
            this.pagination.update((p) => {
                p.max = page;
                return p;
            });
        }

        if (this.errorOccured) {
            return [];
        }

        let items = []

        for (let itemData of itemsObjects) {
            const id = itemData[this.idField];

            items.push(new ListItem(itemData, id));
        }

        return items;
    }

    /**
     * Change the page from a page number (this includes search queries)
     *
     * @param page
     */
    public async changePage(page: number) {
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
        this.state.set('loading');

        // Get previous page
        let previousPage = get(this.pagination).current;

        // Update pagination.current
        this.pagination.update((p) => {
            p.current = page;
            return p;
        });

        let pageItems = await this.getPageItems(page);

        // Return if there is an error getting items
        if (this.errorOccured) {
            this.displayMessage('An error occurred...');
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

        if (pageItems.length === 0) {
            if (this.searcher && get(this.searcher.query)) {
                this.displayMessage(`No results found for <span class="badge bg-light ms-1">${get(this.searcher.query)}</span>`);
            } else {
                this.displayMessage('No items found');
            }

            this.items.set([]);

            return;
        }

        this.state.set('results');
        this.items.set(pageItems);

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

        this.searcher.query.set(null);

        await this.changePage(1);
    }

    public async filterChanged() {
        await this.changePage(1);
    }

    public async search(query: string) {
        if (!this.searcher || get(this.searcher.query) === query) {
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

        await this.changePage(get(this.pagination).current);
    }

    public async bindSearch(value: string|null) {
        this.state.set('loading');

        clearTimeout(this.searcher.searchTimer);
        this.searcher.searchTimer = setTimeout(() => this.searcher && this.search(value), this.searcher?.searchDelay);
    }

    public first() {
        this.changePage(get(this.pagination).min);
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

    public last() {
        this.changePage(get(this.pagination).max ?? get(this.pagination).current);
    }

    public refreshPage() {
        this.changePage(get(this.pagination).current);
    }

    private updatePagination() {
        let inBetweenPages: number[] = [];
        let showPagination = true;

        const { min, max, activePageRange, current } = get(this.pagination);

        if (get(this.items).length === 0) {
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
        if (this.itemCallbacks && this.itemCallbacks.getLastPageNumber !== undefined) {
            const lastPage = await this.itemCallbacks.getLastPageNumber();

            if (lastPage !== false) {
                this.pagination.update(p => {
                    p.max = lastPage;
                    return p;
                })
            }
        }
    }

    public updatePaginationPages(lastPage: number|null, totalItems: number|null = null) {
        this.pagination.update(p => {
            p.max = lastPage;
            p.totalItems = totalItems ?? lastPage * p.perPage;
            return p;
        })
    }

    public useFilters() {
        return get(this.filters).length > 0;
    }

    /**
     * Get a filter value that is enabled
     */
    public getFilterValue(slug: string) {
        let filter = get(this.filters)
            .filter((f) => f.slug === slug)
            .at(0);

        if (!filter || !filter.enabled) {
            return undefined
        }

        // Type specific
        if (filter.type === 'select' && !filter.selectedValue) {
            filter.selectedValue = undefined;
        }

        return filter.selectedValue;
    }

    private async init() {
        // Add spinner
        this.state.set('loading');

        // Render init items
        this.changePage(get(this.pagination).current).then(async () => {
            // If no items, change to the first page
            if (get(this.items).length === 0) {
                await this.changePage(get(this.pagination).min);
            }
        });

        await this.initPagination();

        // Filter watcher
        this.filters.subscribe(() => {
            // For some reason the changePage would be called twice on init...
            if (get(this.state) === 'loading') {
                return;
            }

            this.filterChanged();
        })

        this.triggerEvent('initialised');
    }
}

export default FlexList;