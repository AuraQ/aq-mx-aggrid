import { ReactElement, ReactNode, createElement, useMemo, useRef, useCallback, memo } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, RowClassParams, SideBarDef, RowSelectionOptions, SelectionChangedEvent, IRowNode, ModuleRegistry, CellStyleModule } from 'ag-grid-community';
import { ColumnMenuModule, ColumnsToolPanelModule, ContextMenuModule, PivotModule } from "ag-grid-enterprise";
import { DetailCellRenderer, DetailCellRendererParams } from "./DetailCellRenderer";
import { ConsoleLogger, LogLevel } from "../util/ConsoleLogger";
import { SelectionTypeEnum, SelectionMethodEnum, ColumnsType } from "typings/AgGridProps";
import Big from "big.js";
import CellRenderer from "./CellRenderer";

ModuleRegistry.registerModules([  
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  CellStyleModule 
]);

export interface BasicGridProps {
    columns: ColumnsType[];//ColDef[];
    rowData?: RowData[];
    enableDarkTheme: boolean
    enableMasterDetail: boolean,
    logLevel : LogLevel,
    selectionType : SelectionTypeEnum
    selectionMethod: SelectionMethodEnum | null;
    onSelectionChanged : (selected: any) => void;
    defaultResizable: boolean;
    defaultSortable: boolean;
    defaultReordable: boolean;
    defaultHiding: boolean;
}

export interface RowData {
    guid: string | null;
    _mxObject: any | null;
    [key: string]: any;
    rowClasses? : string;
    isRowMaster : boolean;
    detailContent : ReactNode | null;
}

export const BasicGrid = memo((props: BasicGridProps): ReactElement => {
    const { columns, rowData, enableDarkTheme, enableMasterDetail, logLevel, selectionType, selectionMethod, onSelectionChanged } = props

    const logger = new ConsoleLogger({ level: logLevel }); //TODO - make this global (or usecontext)

    const gridRef = useRef<AgGridReact>(null);

    const {defaultResizable, defaultSortable, defaultReordable, defaultHiding} = props;
    
    const defaultColDef = useMemo(() => { 
	    return {
            resizable : defaultResizable,
            sortable : defaultSortable,
            suppressMovable : !defaultReordable,
            suppressColumnsToolPanel: !defaultHiding
        };
    }, []);

    const isRowMaster = useCallback((dataItem: any) => {
        logger.debug("isRowMaster, dataItem", dataItem);
        const isMaster = dataItem ? dataItem.isRowMaster : false;
        logger.debug("isRowMaster, isMaster", isMaster);
        return isMaster;
    }, []);

    const getRowClass = useCallback((params: RowClassParams) => {
        const rowData = params.data as RowData;
        if (rowData.rowClasses) {
            return rowData.rowClasses.split(" ").map(c => {
                return c.trim();
            });
        }

        return undefined;
    },[]);

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
      ],
      //defaultToolPanel: "columns",
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

    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {        
        if(selectionType == "singleRow"){
            if(selectionMethod == "rowClick"){
                return {
                    mode : "singleRow",
                    checkboxes: false,
                    enableClickSelection: true,
                };                  
            }

            return {
                mode : "singleRow"
            };                 
        }

        if(selectionMethod == "rowClick"){
            return {
                mode : "multiRow",
                checkboxes: false,
                enableClickSelection: true,
            };                  
        }
        
        return {
                mode : "multiRow"
            }; 
    }, []);    

    const handleOnSelectionChanged = useCallback((event: SelectionChangedEvent) => {
        logger.debug("handleOnSelectionChanged, event",event);
        const selected = event.selectedNodes?.map((n)=>{
            return n.data._mxObject;
        })

        logger.debug("selected",selected);
        
        if(selected && selectionType == "singleRow"){
            onSelectionChanged(selected[0]);
        }
        else{
            onSelectionChanged(selected);
        }

    }, []);

    const valueComparator = function (valueA: any, valueB: any, nodeA: IRowNode<any>, nodeB: IRowNode<any>, isDescending: boolean): number {
            logger.debug("valueComparator valueA, valueB, nodeA, nodeB, isDescending", valueA, valueB, nodeA, nodeB, isDescending);
            // sorting based on null values
            if (valueA === null && valueB === null) {
                return 0;
            }
            if (valueA === null) {
                return -1;
            }
            if (valueB === null) {
                return 1;
            }
    
            // type specific sorting
            if (valueA instanceof Date && valueB instanceof Date) {
                logger.debug("valueComparator, Date");
                return (valueA as Date).getTime() - ((valueB as Date)).getTime();
            }
            else if(valueA instanceof Big && valueB instanceof Big) {
                logger.debug("valueComparator, Big");
    
                return (valueA as Big).cmp((valueB as Big));
            }
    
            // sorting based on default values
            if (valueA < valueB) {
                return -1;
            }
            if (valueA >  valueB) {
                return 1;
            }
            return 0;
        };

    const columnDefs: ColDef[] = columns.map((column, i) => {
        const columnDef : ColDef = {
            field: `field${i}`,
            headerName: column.caption,
            cellRenderer: i== 0 && enableMasterDetail ? "agGroupCellRenderer" : CellRenderer,
            cellRendererParams: i== 0 && enableMasterDetail ? {
                mxColumn: column,
                innerRenderer : CellRenderer,
                logLevel : logLevel
            } : {
                mxColumn: column,
                logLevel : logLevel
            },
            autoHeight: true,
            pinned: column.pinColumn === "none" ? null : column.pinColumn,
            lockPosition: column.lockColumn === "none" ? undefined : column.lockColumn,
            comparator : valueComparator,
            headerClass: column.dynamicHeaderClass?.value,
            cellClass : (params) => {
                const className = column.dynamicCellClass?.get(params.data._mxObject).value;
                logger.trace("cellClass, className", className);
                return className;
            },
            wrapText : column.wrapText
        };

        // handle sort
        if(column.showContentAs != 'customContent' && column.canSort == "true"){
            columnDef.sortable = true;
        } else if(column.canSort == "false"){
            columnDef.sortable = false;
        }

        // handle resize
        if(column.canResize == "true"){
            columnDef.resizable = true;
        } else if(column.canResize == "false"){
            columnDef.resizable = false;
        }

        // handle reorder
        if(column.canReorder == "true"){
            columnDef.suppressMovable = false;
        } else if(column.canReorder == "false"){
            columnDef.suppressMovable = true;
        }

        // handle hide
        if(column.canHide === "yesHidden"){
            columnDef.hide = true;
            columnDef.suppressColumnsToolPanel = false;
        } else if(column.canHide === "no"){
            columnDef.suppressColumnsToolPanel = true;
        }
        if(!defaultHiding && column.canHide === "yes"){
            columnDef.suppressColumnsToolPanel = false;
        }

        if(column.widthType == "fixedWidth" && column.fixedWidth && column.fixedWidth > 0){
            columnDef.width = column.fixedWidth;
        }
        else if (column.widthType == "flex" && column.flex && column.flex > 0){
            columnDef.flex = column.flex;
            if(column.minWidth && column.minWidth > 0){
                columnDef.minWidth = column.minWidth;
            }
            if(column.maxWidth && column.maxWidth > 0){
                columnDef.maxWidth = column.maxWidth;
            }
        }

        logger.trace("columnDef", columnDef);
        
        return columnDef;
    });

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
                rowSelection={selectionType == "none" ? undefined : rowSelection}
                onSelectionChanged={handleOnSelectionChanged}
                theme="legacy"
            />
        </div>;
});