import { AgGridPreviewProps } from "../../typings/AgGridProps";
import {
    container,
    dropzone,
    rowLayout,
    selectable,
    structurePreviewPalette,
    text
} from "./structure-utils";
import {PreviewProps} from "./types";

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