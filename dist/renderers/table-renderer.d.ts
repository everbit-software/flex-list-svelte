import { AbstractRenderer, ListStyle, RendererConfig } from "./abstract-renderer";
import { ListItem } from "../list-item";
interface TableRendererConfig extends RendererConfig {
    columns: TableColumn[];
    style?: TableStyle;
}
interface TableColumn {
    label: string;
    key: string;
    isVisible?: boolean;
}
interface TableStyle extends ListStyle {
    tableContainer: string[];
    table: string[];
    thead: string[];
    th?: string[];
    td?: string[];
}
export declare const BootstrapFiveStyle: TableStyle;
export declare class TableRenderer extends AbstractRenderer {
    protected style: TableStyle;
    private columns;
    private rowsContainer;
    constructor(config: TableRendererConfig);
    private generateTableHeader;
    protected generateTableBody(): HTMLElement;
    setup(): void;
    createItemElement(item: ListItem): HTMLElement;
    addItemToContainer(item: ListItem): void;
    clearItems(): void;
    setupSpinner(): void;
    private getRowSpinner;
    toggleSpinner(show: boolean): void;
    showItemSpinner(item: ListItem): void;
    displayMessage(message: string, errorOccured: boolean): void;
}
export {};
