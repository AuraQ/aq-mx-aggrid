import { ReactElement, createElement, useEffect } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ColDef, RowClassParams, ValueFormatterParams } from 'ag-grid-community';
import { LicenseManager } from "ag-grid-enterprise";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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

    const valueFormatter = function (params : ValueFormatterParams) : string {
        console.debug("valueFormatter params", params);
        let value = params.value;
        if(value instanceof Date){
            value = (value as Date).getTime();
        }

        console.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value type`, typeof value);
        console.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value`, value);
        return value;
      };

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
            valueFormatter
        }
    });

    const getRowData = () : RowData[] | undefined => { 
        if(props.gridData.items!.length <= 0 && props.allowPaste){
            // if have no data and want to allow a paste, we'll need an empty row
            const emptyRow: RowData = { guid: "_", _mxObject: null, rowClasses: "_", isDataRow:false};
                // build our data to show
                props.columns.forEach(column=>{
                    const identifier : string= column.columnIdentifier.value!;                                        
                    emptyRow[identifier] = "";
                    
                })
            return [emptyRow];
        }
        
        const rowData = props.gridData.items?.map((item,index)=>{
                // create the base row metadata
                const row: RowData = { guid: item.id, _mxObject: item, rowClasses: props.dynamicRowClasses?.get(item).value, isDataRow:true};
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

        return rowData;
    }

    const getRowClass = (params: RowClassParams) => {
        const rowData = params.data as RowData;       
        if(rowData.rowClasses){
            return rowData.rowClasses.split(" ").map((c)=>{
                return c.trim();
            });
        }
        
        return undefined;
    };

    const processPastedData =(data : string) =>{
        // set the attribute value
        if(props.pastedDataAttribute){
            props.pastedDataAttribute.setValue(data);

            // fire the onPaste event
            if (props.onPaste != undefined) {
                if (props.onPaste.canExecute && !props.onPaste.isExecuting) {
                    props.onPaste.execute();
                }
            }
        }
        
        return null;
    }
    

    return <BasicGrid enableDarkTheme={props.enableDarkTheme.value!} columnDefs={columnDefs} rowData={getRowData()} getRowClass={getRowClass} processPastedData={processPastedData} allowPaste={props.allowPaste.value!} />;
}
