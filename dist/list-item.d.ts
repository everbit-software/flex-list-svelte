export declare class ListItem {
    data: object;
    id: string | number;
    page: number;
    element: HTMLElement | null;
    constructor(data: object, id: string | number, page: number, element?: HTMLElement | null);
    isDisplayed(): boolean;
    update(data: object, id?: string | number): void;
}
