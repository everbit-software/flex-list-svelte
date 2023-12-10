interface Filter {
    slug: string;
    name: string;
    type: 'text'|'numberRange'|'boolean';
    enabled?: boolean;
    selectedValue?: any;
    options?: any;
}