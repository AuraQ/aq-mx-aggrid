import { ReactElement, createElement } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ColDef, RowClassParams } from 'ag-grid-community';

import "./ui/AgGrid.css";
//props: AgGridContainerProps
export function AgGrid(props: AgGridContainerProps): ReactElement {
    console.debug("main props",props);
    if(props.gridData.status !== "available"){
        return <div></div>;
    }

    const columnDefs : ColDef[]= props.columns.map(column=>{
        return {
            field: column.columnIdentifier.value,
            headerName: column.caption,
            cellRenderer: CellRenderer,
            cellRendererParams: {
              mxColumn: column,
              showEditMode: props.showEditMode.value
            },
            autoHeight: true,
        }
    });

    const rowData : RowData[] | undefined= props.gridData.items?.map(item=>{
        // create the base row metadata
        const row: RowData = { guid: item.id, _mxObject: item, rowClasses: props.dynamicRowClasses?.get(item).value};
        // no need to create column data as it will be handled by our cell renderer
        return row;
    })

    const getRowClass = (params: RowClassParams) => {
        const rowData = params.data as RowData;       
        if(rowData.rowClasses){
            return rowData.rowClasses.split(" ").map((c)=>{
                return c.trim();
            });
        }
        
        return undefined;
    };


    return <BasicGrid columnDefs={columnDefs} rowData={rowData} getRowClass={getRowClass} />;
}
