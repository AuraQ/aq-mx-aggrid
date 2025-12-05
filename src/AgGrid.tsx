import { ReactElement, createElement, useCallback, useEffect, useState } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ModuleRegistry, ClientSideRowModelModule, RowStyleModule, RowAutoHeightModule, RowSelectionModule  } from "ag-grid-community";
import { LicenseManager,MasterDetailModule, SideBarModule } from "ag-grid-enterprise";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "./ui/AgGrid.css";
import { ConsoleLogger } from "./util/ConsoleLogger";
import Big from "big.js";

ModuleRegistry.registerModules([
  MasterDetailModule,
  ClientSideRowModelModule,
  RowStyleModule,
  RowAutoHeightModule,
  SideBarModule,
  RowSelectionModule
]);

export function AgGrid(props: AgGridContainerProps): ReactElement {
    const [mxGridData, setMxGridData] = useState<any>([]);
    const logLevel = props.logLevel.value != 'error' && props.logLevel.value != 'warn' && props.logLevel.value != 'debug' && props.logLevel.value != 'trace' ? 'log' : props.logLevel.value
    const logger = new ConsoleLogger({ level: logLevel });

    logger.debug("main props", props);
    

    useEffect(() => {
        const key = props.licenceKey.value!.toString();
        LicenseManager.setLicenseKey(key);
    }, []);

    useEffect(()=>{
        const rowData = props.gridData.items?.map((item, index) => {
                // create the base row metadata
                const row: RowData = {
                    guid: item.id,
                    _mxObject: item,
                    rowClasses: props.dynamicRowClasses?.get(item).value,
                    isDataRow: true,
                    isRowMaster: props.rowIsMaster?.get(item).value!,
                    detailContent : props.detailContent?.get(item)
                };
                // build our data to show
                props.columns.forEach((column, i) => {
                    const identifier: string = `field${i}`;
                    let value = column.attribute.get(item).value;
                    if (value instanceof Date) {
                        value = (value as Date).getTime();
                    }
                    if (value instanceof Big) {
                        value = (value as Big).toNumber();
                    }
    
                    logger.trace(`Row ${index}, Column "${identifier}" - value type, value`, typeof value, value);
    
                    row[identifier] = value;
                });
                return row;
            });

        setMxGridData(rowData);

    },[props.gridData]);

    const onSelectionChanged = useCallback((selected : any) => {
        logger.debug("selected",selected);
        if(props.selectionType == "none"){
            return;
        }

        if(props.selectionType == "singleRow"){
            logger.trace("props.singleSelectedAssociation",props.singleSelectedAssociation);
            // set the single association
            if (props.singleSelectedAssociation) {                
                props.singleSelectedAssociation.setValue(selected ? selected : undefined);                
            }
        }
        else if(props.selectionType == "multiRow"){
            logger.trace("props.multiSelectedAssociation",props.multiSelectedAssociation);
            // set the multi association
            if (props.multiSelectedAssociation) {                
                props.multiSelectedAssociation.setValue(selected ?? []);
            }
        }

        if (props.onSelectionChanged && props.onSelectionChanged.canExecute && !props.onSelectionChanged.isExecuting) {
                props.onSelectionChanged.execute();
            }
    }, [props.singleSelectedAssociation,props.multiSelectedAssociation]);

    if (props.gridData.status !== "available" && 
        (
            (props.selectionType == "singleRow" && props.singleSelectedAssociation && props.singleSelectedAssociation.status !== "available") ||
            (props.selectionType == "multiRow" && props.multiSelectedAssociation && props.multiSelectedAssociation.status !== "available")
        )
    )  {
        return <div></div>;
    }

    return (
        <BasicGrid
            enableDarkTheme={props.enableDarkTheme.value!}
            columns={props.columns}
            rowData={mxGridData}
            enableMasterDetail={props.enableMasterDetail}
            logLevel={logLevel}
            selectionType={props.selectionType}
            selectionMethod={props.selectionType == "none" ? null : props.selectionMethod}
            defaultResizable={props.defaultResizable}
            defaultSortable={props.defaultSortable}
            defaultReordable={props.defaultReordable}
            onSelectionChanged={onSelectionChanged}
        />
    );
}
