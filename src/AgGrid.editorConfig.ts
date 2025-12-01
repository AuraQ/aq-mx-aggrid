import { AgGridPreviewProps } from "../typings/AgGridProps";
import {
    container,
    datasource,
    dropzone,
    rowLayout,
    selectable,
    structurePreviewPalette,
    PreviewProps,
    text
} from "src/util/editorConfig";
import { hideNestedPropertiesIn, hidePropertyIn } from "@mendix/pluggable-widgets-tools";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

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
    });

    if (!values.enableMasterDetail) {
        hidePropertyIn(defaultProperties, values, "rowIsMaster");
        hidePropertyIn(defaultProperties, values, "detailContent");
    }
    return defaultProperties;
}

export function getPreview(
    values: AgGridPreviewProps,
    isDarkMode: boolean,
    _spVersion: number[] = [0, 0, 0]
): PreviewProps {
    // Customize your pluggable widget appearance for Studio Pro.

    // const [major, minor] = spVersion;
    // const canHideDataSourceHeader = major > 9 || (major === 9 && minor >= 20); //TODO - research this in more detail (copied from DG2)

    const palette = structurePreviewPalette[isDarkMode ? "dark" : "light"];
    const hasColumns = values.columns && values.columns.length > 0;
    const enableMasterDetail = values.enableMasterDetail;

    const getColumns = () => {
        if (hasColumns) {
            return values.columns.map(column =>
                container({
                    borders: true,
                    grow: 1, //TODO - change this if we allow a manual setting of column width
                    backgroundColor: undefined //TODO - change this if we allow a column to be hidden - to indicate which ones are hidden by default
                })(
                    column.showContentAs === "customContent"
                        ? dropzone({ placeholder: "Enter custom content here", showDataSourceHeader: true })(
                              column.content
                          )
                        : container({
                              padding: 8
                          })(
                              text({ fontSize: 10, fontColor: palette.text.secondary })(
                                  column.showContentAs === "dynamicText"
                                      ? column.dynamicText ?? "Dynamic text"
                                      : `[${column.attribute ? column.attribute : "No attribute selected"}]`
                              )
                          )
                )
            );
        }

        return [
            text({ fontColor: palette.text.data })(
                "No columns defined. Please add at least one column in the properties"
            )
        ];
    };

    const masterDetailContentSection = container()(
        enableMasterDetail
            ? container()
            (
                dropzone({ placeholder: "Enter detail content here (for master/detail)", showDataSourceHeader: true })(
                    values.detailContent
                )
            )
            : container()()
    );

    const columnLayout = container()(
        rowLayout({ columnSize: "fixed" })(...getColumns()),
        masterDetailContentSection);

    const getColumnHeaders = () => {
        if (hasColumns) {
            return values.columns.map(column => {
                const content = container({
                    borders: true,
                    grow: 1, //TODO - change this if we allow a manual setting of column width
                    backgroundColor: palette.background.topbarStandard //TODO - change this if we allow a column to be hidden - to indicate which ones are hidden by default
                })(
                    rowLayout({
                        columnSize: "grow"
                    })(
                        container({
                            grow: 0,
                            backgroundColor: "#AEEdAA"
                        })(
                            container({
                                padding: 0 //TODO - change this if we allow a column to be hidden (see DG2
                            })()
                        ),
                        container({
                            padding: 8
                        })(
                            container({
                                grow: 1,
                                padding: 8
                            })(
                                text({
                                    bold: true,
                                    fontSize: 10,
                                    fontColor: palette.text.secondary
                                })(column.caption ? column.caption : "Header")
                            )
                        )
                    )
                );

                return selectable(column, { grow: 1 })(container()(content));
            });
        }

        return [];
    };

    const columnHeaderLayout = rowLayout({ columnSize: "fixed" })(...getColumnHeaders());

    const gridTitle = rowLayout({
        columnSize: "fixed",
        backgroundColor: palette.background.topbarData,
        borders: true,
        borderWidth: 1
    })(
        container({
            padding: 4
        })(text({ fontColor: palette.text.data })("AG Grid"))
    );

    return container()(
        gridTitle,
        columnHeaderLayout,
        ...Array.from({ length: hasColumns ? 5 : 1 }).map(() => columnLayout)
    );
}

export function getCustomCaption(values: AgGridPreviewProps): string {
    type DsProperty = { caption?: string };
    const dsProperty: DsProperty = datasource(values.gridData)().property ?? {};
    return dsProperty.caption || "AG Grid";
}

// custom validation
export { check } from "./util/consistency-check";
