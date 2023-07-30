import { ListItem } from "../../list-item";
import { AbstractRenderer, RendererConfig } from "../abstract-renderer";
export interface ListGroupRendererConfig extends RendererConfig {
    renderRow: (item: ListItem) => HTMLElement | string;
    renderItemSpinner: (item: ListItem) => HTMLElement;
}
export declare class ListGroupRenderer extends AbstractRenderer {
    private itemsContainer;
    private readonly renderRow;
    private readonly renderItemSpinner;
    constructor(config: ListGroupRendererConfig);
    setup(): void;
    createItemElement(item: ListItem): HTMLElement;
    addItemToContainer(item: ListItem): void;
    clearItems(): void;
    setupSpinner(): void;
    toggleSpinner(show: boolean): void;
    showItemSpinner(item: ListItem): void;
    displayMessage(message: string, errorOccured: boolean): void;
}
