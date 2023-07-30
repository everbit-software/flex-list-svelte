import { ListItem } from "../../list-item";
import { AbstractRenderer, RendererConfig } from "../abstract-renderer";
export interface CardRendererConfig extends RendererConfig {
    columnClasses?: string[];
    renderRow: (item: ListItem) => HTMLElement | string;
    renderItemSpinner: (item: ListItem) => HTMLElement;
}
export declare class CardRenderer extends AbstractRenderer {
    private itemsContainer;
    private readonly renderRow;
    private readonly renderItemSpinner;
    private readonly columnClasses;
    constructor(config: CardRendererConfig);
    setup(): void;
    createItemElement(item: ListItem): HTMLElement;
    addItemToContainer(item: ListItem): void;
    clearItems(): void;
    setupSpinner(): void;
    toggleSpinner(show: boolean): void;
    showItemSpinner(item: ListItem): void;
    displayMessage(message: string, errorOccured: boolean): void;
}
