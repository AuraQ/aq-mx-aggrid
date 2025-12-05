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
        if (column.widthType === "default") {
            hideNestedPropertiesIn(defaultProperties, values, "columns", index, ["fixedWidth","flex","minWidth","maxWidth"]);
        }
        if (column.widthType === "fixedWidth") {
            hideNestedPropertiesIn(defaultProperties, values, "columns", index, ["flex","minWidth","maxWidth"]);
        }
        if (column.widthType === "flex") {
            hideNestedPropertiesIn(defaultProperties, values, "columns", index, ["fixedWidth"]);
        }
    });

    if (!values.enableMasterDetail) {
        hidePropertyIn(defaultProperties, values, "rowIsMaster");
        hidePropertyIn(defaultProperties, values, "detailContent");
    }

    if (values.selectionType == "none") {
        hidePropertyIn(defaultProperties, values, "selectionMethod");
        hidePropertyIn(defaultProperties, values, "singleSelectedAssociation");
        hidePropertyIn(defaultProperties, values, "multiSelectedAssociation");
        hidePropertyIn(defaultProperties, values, "onSelectionChanged");
    }

    if (values.selectionType == "singleRow") {
        hidePropertyIn(defaultProperties, values, "multiSelectedAssociation");
    }

    if (values.selectionType == "multiRow") {
        hidePropertyIn(defaultProperties, values, "singleSelectedAssociation");
    }
    return defaultProperties;
}