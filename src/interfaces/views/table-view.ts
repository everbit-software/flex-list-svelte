import { ListItem } from "../../list-item";

export type ViewCallback = (data: any, item: ListItem) => string;

export interface TableColumn {
    id: string;
    label: string;
    isSortable?: boolean; // default true
    viewCallback?: ViewCallback;
}