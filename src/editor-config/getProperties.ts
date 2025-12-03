import {AgGridPreviewProps} from "../../typings/AgGridProps";
import { Properties } from "./types";
import { hidePropertyIn, hideNestedPropertiesIn } from "@mendix/pluggable-widgets-tools";

export function getProperties(
    values: AgGridPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    values.columns.forEach((column, index) => {
        if (column.showContentAs !== "dynamicText") {
            hidePropertyIn(defaultProperties, values, "columns", index, "dynamicText");
        }
        if (column.showContentAs !== "customContent") {
            hideNestedPropertiesIn(defaultProperties, values, "columns", index, ["content", "allowEventPropagation"]);
        }
        if (column.showContentAs === "customContent") {
            hidePropertyIn(defaultProperties, values, "columns", index, "canSort");
        }
    });

    if (!values.enableMasterDetail) {
        hidePropertyIn(defaultProperties, values, "rowIsMaster");
        hidePropertyIn(defaultProperties, values, "detailContent");
    }
    return defaultProperties;
}