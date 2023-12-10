interface Filter {
    slug: string;
    name: string;
    type: 'text'|'select'|'boolean';
    enabled?: boolean;
    selectedValue?: any;
    options?: any;
}