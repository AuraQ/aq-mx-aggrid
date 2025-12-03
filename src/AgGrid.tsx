import { ReactElement, createElement, useEffect } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ModuleRegistry, ColDef, RowClassParams, ValueFormatterParams, IRowNode } from "ag-grid-community";
import { LicenseManager,MasterDetailModule } from "ag-grid-enterprise";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "./ui/AgGrid.css";
import Big from "big.js";
import { ConsoleLogger } from "./util/ConsoleLogger";

ModuleRegistry.registerModules([
  MasterDetailModule
]);


export function AgGrid(props: AgGridContainerProps): ReactElement {
    const logLevel = props.logLevel.value != 'error' && props.logLevel.value != 'warn' && props.logLevel.value != 'debug' ? 'log' : props.logLevel.value
    const logger = new ConsoleLogger({ level: logLevel });

    logger.debug("main props", props);

    useEffect(() => {
        const key = props.licenceKey.value!.toString();
        LicenseManager.setLicenseKey(key);
    }, []);

    if (props.gridData.status !== "available") {
        return <div></div>;
    }

    // this is pointless - we have a custom cell renderer which overrides this value
    const valueFormatter = function (params: ValueFormatterParams): string {
        logger.debug("valueFormatter params", params);
        let value = params.value;
        if (value instanceof Date) {
            logger.debug("valueFormatter, Date");
            value = (value as Date).getTime();
        }
        else if(value instanceof Big){
            logger.debug("valueFormatter, Big");
            value = (value as Big).toString();
        }

        logger.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value type`, typeof value);
        logger.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value`, value);
        return value;
    };

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

    const columnDefs: ColDef[] = props.columns.map((column, i) => {
        return {
            field: `field${i}`,
            headerName: column.caption,
            cellRenderer: i== 0 && props.enableMasterDetail ? "agGroupCellRenderer" : CellRenderer,
            cellRendererParams: i== 0 && props.enableMasterDetail ? {
                mxColumn: column,
                innerRenderer : CellRenderer,
                logLevel : logLevel
            } : {
                mxColumn: column,
                logLevel : logLevel
            },
            autoHeight: true,
            valueFormatter,
            pinned: column.pinColumn === "none" ? null : column.pinColumn,
            lockPosition: column.lockColumn === "none" ? undefined : column.lockColumn,
            suppressMovable : column.preventMoveColumn,
            sortable : column.showContentAs != 'customContent' && column.canSort,
            comparator : valueComparator
        };
    });

    const getRowData = (): RowData[] | undefined => {
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

                logger.debug(`Row ${index}, Column "${identifier}" - value type`, typeof value);
                logger.debug(`Row ${index}, Column "${identifier}" - value`, value);

                row[identifier] = value;
            });
            return row;
        });

        return rowData;
    };

    const getRowClass = (params: RowClassParams) => {
        const rowData = params.data as RowData;
        if (rowData.rowClasses) {
            return rowData.rowClasses.split(" ").map(c => {
                return c.trim();
            });
        }

        return undefined;
    };

    

    return (
        <BasicGrid
            enableDarkTheme={props.enableDarkTheme.value!}
            columnDefs={columnDefs}
            rowData={getRowData()}
            getRowClass={getRowClass}
            enableMasterDetail={props.enableMasterDetail}
            logLevel={logLevel}
        />
    );
}
