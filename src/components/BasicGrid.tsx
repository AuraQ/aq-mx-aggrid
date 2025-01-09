import { ReactElement, createElement, useMemo, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowClassParams, SideBarDef, ProcessDataFromClipboardParams } from 'ag-grid-community';

export interface BasicGridProps {
    columnDefs: ColDef[];
    rowData?: RowData[];
    getRowClass: (params: RowClassParams) => string  |  string[]  |  undefined
    enableDarkTheme: boolean
    allowPaste : boolean
    processPastedData : (data: string) => null
}

export interface RowData {
    guid: string | null;
    _mxObject: any | null;
    [key: string]: any;
    rowClasses? : string;
    isDataRow : boolean; // set to false if we have an empty data source list and need to support paste (AG Grid currently doesn't support paste into an empty grid)
}

//ModuleRegistry.registerModules([SideBarModule, ColumnsToolPanelModule]);

export function BasicGrid({ columnDefs, rowData, getRowClass, enableDarkTheme, allowPaste, processPastedData }: BasicGridProps): ReactElement {

    const gridRef = useRef<AgGridReact>(null);    

    const sideBar = useMemo<SideBarDef | string | string[] | boolean | null>(() => {
        return {
        toolPanels: [
            {
            id: "columns",
            labelDefault: "Columns",
            labelKey: "columns",
            iconKey: "columns",
            toolPanel: "agColumnsToolPanel",
            toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
                suppressColumnFilter: true,
                suppressColumnSelectAll: true,
                suppressColumnExpandAll: true,
            },
            },
        ]
        };
    }, []);

    const processDataFromClipboard = (params: ProcessDataFromClipboardParams): string[][] | null => { 
        console.debug("Pasted from clipboard params", params);
        if(gridRef.current){
            const displayedColumns = gridRef.current.api.getAllDisplayedColumns();
            const allRows : any = [];
            const rowLength = params.data.length || 0;
            params.data.forEach((pastedRow, index)=>{

                // suppressLastEmptyLineOnPaste does not seem to work.
                // if we are on the last row, and the data is an array with a single empty value
                // ignore it!
                if((index == rowLength-1) && pastedRow.length == 1 && pastedRow[0] === ""){
                    return;
                }

                //let currentColumn = displayedColumns![0];
                const rowData : any = {};
                pastedRow.forEach((rowCell: any, index) => {
                    const currentColumn = displayedColumns[index];
                    rowData[currentColumn.getColId()] = rowCell
                });

                allRows.push(rowData);
            })
    
            console.debug("Pasted data as json", JSON.stringify(allRows));    
            
            processPastedData(JSON.stringify(allRows));
        }
        
        // we will marshall the data through Mendix so always return null here
        return null;
    };


    return <div className={enableDarkTheme?"ag-theme-quartz-dark":"ag-theme-quartz"} style={{ height: 500 }}>
    <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowClass={getRowClass}
        sideBar= {sideBar}
        processDataFromClipboard={processDataFromClipboard}
        suppressLastEmptyLineOnPaste={true}
        suppressClipboardPaste={!allowPaste}
    />
</div>;
}
