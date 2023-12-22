import FlexList, { FetchCallback } from "../flex-list";
import { Option } from "../options";
import { Search } from "../search";

export interface DisplayedOptions {
    // Allows the user to change the view. Accepts an array of view IDs
    multiView?: string[];
}

export interface ListConfig {
    idField: string;
    search?: Search;
    perPage?: number
    itemCallbacks?: ItemCallbacks;
    fetchCallback?: FetchCallback;
    filters?: Filter[];
    displayedOptions?: DisplayedOptions;
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

export interface SearchConfig {
    searchDelay?: number;
}

export interface Filter {
    slug: string;
    name: string;
    type: 'text'|'select'|'boolean';
    enabled?: boolean;
    selectedValue?: any;
    options?: any;
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