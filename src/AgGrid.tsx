import { ReactElement, createElement, useEffect } from "react";
import { BasicGrid, RowData } from "./components/BasicGrid";
import CellRenderer from "./components/CellRenderer";
import { AgGridContainerProps } from "../typings/AgGridProps";
import { ModuleRegistry, ColDef, RowClassParams, ValueFormatterParams } from "ag-grid-community";
import { LicenseManager,MasterDetailModule } from "ag-grid-enterprise";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "./ui/AgGrid.css";

ModuleRegistry.registerModules([
  MasterDetailModule
]);

export function AgGrid(props: AgGridContainerProps): ReactElement {
    console.debug("main props", props);

    useEffect(() => {
        const key = props.licenceKey.value!.toString();
        LicenseManager.setLicenseKey(key);
    }, []);

    if (props.gridData.status !== "available") {
        return <div></div>;
    }

    const valueFormatter = function (params: ValueFormatterParams): string {
        console.debug("valueFormatter params", params);
        let value = params.value;
        if (value instanceof Date) {
            value = (value as Date).getTime();
        }

        console.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value type`, typeof value);
        console.debug(`Row ${params.node?.rowIndex}, Column "${params.colDef.field}" - value`, value);
        return value;
    };

    const columnDefs: ColDef[] = props.columns.map((column, i) => {
        return {
            field: `field${i}`,
            headerName: column.caption,
            cellRenderer: i== 0 && props.enableMasterDetail ? "agGroupCellRenderer" : CellRenderer,
            cellRendererParams: i== 0 && props.enableMasterDetail ? {
                mxColumn: column,
                innerRenderer : CellRenderer
            } : {
                mxColumn: column
            },
            autoHeight: true,
            valueFormatter
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

                console.debug(`Row ${index}, Column "${identifier}" - value type`, typeof value);
                console.debug(`Row ${index}, Column "${identifier}" - value`, value);

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
        />
    );
}
