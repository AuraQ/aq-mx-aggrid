import { ReactElement, createElement } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ColDef, RowClassParams } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule  } from 'ag-grid-enterprise'; 

export interface BasicGridProps {
    columnDefs: ColDef[];
    rowData?: RowData[];
    getRowClass: (params: RowClassParams) => string  |  string[]  |  undefined
}

export interface RowData {
    guid: string | null;
    _mxObject: any | null;
    [key: string]: any;
    rowClasses? : string;
}

ModuleRegistry.registerModules([SideBarModule, ColumnsToolPanelModule]);

export function BasicGrid({ columnDefs, rowData, getRowClass }: BasicGridProps): ReactElement {

    return <div
    // define a height because the Data Grid will fill the size of the parent container
    style={{ height: 500 }}
>
    <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            getRowClass={getRowClass}
            sideBar= {"columns"}
    />
</div>;
}
