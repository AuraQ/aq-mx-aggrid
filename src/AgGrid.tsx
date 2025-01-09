import { ReactElement, createElement, useEffect } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ColDef, RowClassParams } from 'ag-grid-community';
import { LicenseManager } from "ag-grid-enterprise";

import "./ui/AgGrid.css";
export function AgGrid(props: AgGridContainerProps): ReactElement {
    console.debug("main props",props);

    useEffect(() => {
        const key = props.licenceKey.value!.toString();
        LicenseManager.setLicenseKey(key);
      }, []);


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

    const rowData : RowData[] | undefined= props.gridData.items?.map((item,index)=>{
        // create the base row metadata
        const row: RowData = { guid: item.id, _mxObject: item, rowClasses: props.dynamicRowClasses?.get(item).value};
        // build our data to show
        props.columns.forEach(column=>{
            const identifier : string= column.columnIdentifier.value!;
            let value = column.attribute.get(item).value;
            if(value instanceof Date){
                value = (value as Date).getTime();
            }

            console.debug(`Row ${index}, Column "${identifier}" - value type`, typeof value);
            console.debug(`Row ${index}, Column "${identifier}" - value`, value);
            
            row[identifier] = value;
            
        })
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
