import { ReactElement, createElement } from "react";
//import { AgGridPreviewProps } from "../typings/AgGridProps";
//props: AgGridPreviewProps
export function preview(): ReactElement {
    return <div>Please use 'Structure mode' to view widget. Not currently supported through 'Design mode'</div>;
}

export function getPreviewCss(): string {
    return require("./ui/AgGrid.css");
}
