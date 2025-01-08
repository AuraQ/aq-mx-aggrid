import { ReactElement, createElement } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ColDef } from 'ag-grid-community';

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
              mxColumn: column
            },
            autoHeight: true,
        }
    });

    const rowData : RowData[] | undefined= props.gridData.items?.map(item=>{
        // create the base row metadata
        const row: RowData = { guid: item.id, _mxObject: item, creatable: false};//, columns: props.columns };
        // create the column data
        props.columns.forEach(column=>{
            const identifier : string= column.columnIdentifier.value!;
            row[identifier] = column.attribute.get(item).value;
            
        })
        return row;
    })

    // const rowData = datasource.items.map(item => {
    //     const row: RowData = { guid: item.id, _mxObject: item, creatable: false };
    //     columns.forEach((column, i) => {
    //         if (column.type === "DateTime") {
    //             row[`field${i}`] = column.attribute!.get(item).value;
    //         } else if (column.type === "Boolean") {
    //             row[`field${i}`] = column.attribute!.get(item).displayValue === "Yes" ? "true" : "false"; // ensures data is properly displayed 
    //         } else {
    //             row[`field${i}`] = column.attribute!.get(item).displayValue;
    //         }
    //     });
    //     return row;
    // }).filter(row => row !== null) as RowData[];


    return <BasicGrid columnDefs={columnDefs} rowData={rowData} />;
}
