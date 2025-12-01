import { ReactElement, ReactNode, createElement, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClassParams, SideBarDef } from 'ag-grid-community';
import { DetailCellRenderer, DetailCellRendererParams } from "./DetailCellRenderer";


export interface BasicGridProps {
    columnDefs: ColDef[];
    rowData?: RowData[];
    getRowClass: (params: RowClassParams) => string  |  string[]  |  undefined
    enableDarkTheme: boolean
    enableMasterDetail: boolean
}

export interface RowData {
    guid: string | null;
    _mxObject: any | null;
    [key: string]: any;
    rowClasses? : string;
    isRowMaster : boolean;
    detailContent : ReactNode | null;
}

export function BasicGrid({ columnDefs, rowData, getRowClass, enableDarkTheme, enableMasterDetail }: BasicGridProps): ReactElement {
console.debug("enableMasterDetail", enableMasterDetail);
    const gridRef = useRef<AgGridReact>(null);

    const isRowMaster = useCallback((dataItem: any) => {
        console.debug("isRowMaster, dataItem", dataItem);
        const isMaster = dataItem ? dataItem.isRowMaster : false;
        console.debug("isRowMaster, isMaster", isMaster);
        return isMaster;
    }, []);

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
    
    const detailCellRenderer = useCallback(DetailCellRenderer, [rowData]);

    const detailCellRendererParams = useMemo(() => { 
        return (params : ICellRendererParams) => {
            const res : DetailCellRendererParams = {
                detailContent: params.data.detailContent
            };
            return res;
        };
    }, []);

    return <div className={enableDarkTheme?"ag-theme-quartz-dark":"ag-theme-quartz"} style={{ height: 500 }}>
    <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowClass={getRowClass}
        sideBar= {sideBar}
        masterDetail={enableMasterDetail}
        isRowMaster={isRowMaster}
        detailCellRenderer={detailCellRenderer}
        detailCellRendererParams={detailCellRendererParams}
    />
</div>;
}
