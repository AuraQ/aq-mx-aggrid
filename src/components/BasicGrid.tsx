import { ReactElement, ReactNode, createElement, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClassParams, SideBarDef } from 'ag-grid-community';
import { DetailCellRenderer, DetailCellRendererParams } from "./DetailCellRenderer";
import { ConsoleLogger, LogLevel } from "../util/ConsoleLogger";


export interface BasicGridProps {
    columnDefs: ColDef[];
    rowData?: RowData[];
    getRowClass: (params: RowClassParams) => string  |  string[]  |  undefined
    enableDarkTheme: boolean
    enableMasterDetail: boolean,
    logLevel : LogLevel,
    defaultColDef : any
}

export interface RowData {
    guid: string | null;
    _mxObject: any | null;
    [key: string]: any;
    rowClasses? : string;
    isRowMaster : boolean;
    detailContent : ReactNode | null;
}

export function BasicGrid({ columnDefs, rowData, getRowClass, enableDarkTheme, enableMasterDetail, logLevel, defaultColDef }: BasicGridProps): ReactElement {
    const logger = new ConsoleLogger({ level: logLevel }); //TODO - make this global
    logger.debug("enableMasterDetail", enableMasterDetail);
    const gridRef = useRef<AgGridReact>(null);

    const isRowMaster = useCallback((dataItem: any) => {
        logger.debug("isRowMaster, dataItem", dataItem);
        const isMaster = dataItem ? dataItem.isRowMaster : false;
        logger.debug("isRowMaster, isMaster", isMaster);
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
        defaultColDef={defaultColDef}
        getRowClass={getRowClass}
        sideBar= {sideBar}
        masterDetail={enableMasterDetail}
        isRowMaster={isRowMaster}
        detailCellRenderer={detailCellRenderer}
        detailCellRendererParams={detailCellRendererParams}
        detailRowAutoHeight={true}
    />
</div>;
}
