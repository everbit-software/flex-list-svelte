import { AbstractRenderer, RendererConfig } from "./abstract-renderer";
import { ListItem } from "../list-item";
interface ListRenderConfig extends RendererConfig {
    renderItem: (item: ListItem) => string;
    isOrdered?: boolean;
}
export declare class BasicListRenderer extends AbstractRenderer {
    private renderItem;
    private list;
    private isOrdered;
    constructor(config: ListRenderConfig);
    setup(): void;
    createItemElement(item: ListItem): HTMLElement;
    addItemToContainer(item: ListItem): void;
    clearItems(): void;
    setupSpinner(): void;
    private getSpinnerElement;
    toggleSpinner(show: boolean): void;
    showItemSpinner(item: ListItem): void;
    displayMessage(message: string, errorOccured: boolean): void;
}
export {};
