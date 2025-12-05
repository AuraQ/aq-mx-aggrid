import { createElement } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import { ColumnsType } from "typings/AgGridProps";
import {CustomContent} from "./CustomContent";
import { ConsoleLogger, LogLevel } from "../util/ConsoleLogger";

interface CellRendererParams extends CustomCellRendererProps {
    mxColumn: ColumnsType;
    logLevel : LogLevel
}

export default (params: CellRendererParams) => {
    const logger = new ConsoleLogger({ level: params.logLevel }); //TODO - make this global
    logger.trace("CellRendererParams", params);
    if (params.data.isDataRow) {
        logger.trace("Attribute", params.mxColumn.attribute?.get(params.data._mxObject));
        switch (params.mxColumn.showContentAs) {
            case "attribute":
            case "dynamicText": {
                return (
                    <span className="aggrid-text">
                        {params.mxColumn.showContentAs === "attribute"
                            ? params.mxColumn.attribute?.get(params.data._mxObject)?.displayValue
                            : params.mxColumn.dynamicText?.get(params.data._mxObject)?.value}
                    </span>
                );
            }
            case "customContent": {
                return (
                    <CustomContent allowEventPropagation={params.mxColumn.allowEventPropagation}>
                        {params.mxColumn.content?.get(params.data._mxObject)}
                    </CustomContent>
                );
            }
            default:
                throw new Error(`Unknown content type: ${params.mxColumn.showContentAs}`);
        }
    } else {
        return <div></div>;
    }
};


