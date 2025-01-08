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
// import {
//     container,
//     datasource,
//     dropzone,
//     rowLayout,
//     selectable,
//     StructurePreviewProps,
//     text,
//     structurePreviewPalette
// } from "src/util/structure-util";

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
    _values: AgGridPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */
    return defaultProperties;
}

// export function check(_values: AgGridPreviewProps): Problem[] {
//     const errors: Problem[] = [];
//     // Add errors to the above array to throw errors in Studio and Studio Pro.
//     /* Example
//     if (values.myProperty !== "custom") {
//         errors.push({
//             property: `myProperty`,
//             message: `The value of 'myProperty' is different of 'custom'.`,
//             url: "https://github.com/myrepo/mywidget"
//         });
//     }
//     */
//     return errors;
// }



export function getPreview(values: AgGridPreviewProps, isDarkMode: boolean, spVersion: number[] = [0, 0, 0]): PreviewProps {
    // Customize your pluggable widget appearance for Studio Pro.
    
    const [major, minor] = spVersion;
    const canHideDataSourceHeader = major > 9 || (major === 9 && minor >= 20); //TODO - research this in more detail (copied from DG2)

    const palette = structurePreviewPalette[isDarkMode ? "dark" : "light"];
    const hasColumns = values.columns && values.columns.length > 0;

    const getColumns = () => {
        if(hasColumns){
            return values.columns.map(column =>
                container({
                    borders: true,
                    grow: 1, //TODO - change this if we allow a manual setting of column width
                    backgroundColor:undefined //TODO - change this if we allow a column to be hidden - to indicate which ones are hidden by default
                })(
                    column.showContentAs === "customContent"
                        ? dropzone(dropzone.hideDataSourceHeaderIf(canHideDataSourceHeader))(column.content)                    
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
            )
        }

        return [text({ fontColor: palette.text.data })("No columns defined. Please add at least one column in the properties")];
    }

    const columnLayout = rowLayout({columnSize: "fixed"})(...getColumns());

    // const noColumns = rowLayout({
    //     columnSize: "fixed"
    // })(...[text({ fontColor: palette.text.data })("No columns defined. Please add at least one column in the properties")]);
    
    // const columns = rowLayout({
    //     columnSize: "fixed"
    // })(
    //     ...values.columns.map(column =>
    //         container({
    //             borders: true,
    //             grow: 1, //TODO - change this if we allow a manual setting of column width
    //             backgroundColor:undefined //TODO - change this if we allow a column to be hidden - to indicate which ones are hidden by default
    //         })(
    //             column.showContentAs === "customContent"
    //                 ? dropzone(dropzone.hideDataSourceHeaderIf(canHideDataSourceHeader))(column.content)                    
    //                 : container({
    //                       padding: 8
    //                   })(
    //                       text({ fontSize: 10, fontColor: palette.text.secondary })(
    //                           column.showContentAs === "dynamicText"
    //                               ? column.dynamicText ?? "Dynamic text"
    //                               : `[${column.attribute ? column.attribute : "No attribute selected"}]`
    //                       )
    //                   )
    //         )
    //     )
    // );

    const getColumnHeaders = () => {
        if(hasColumns){
            return values.columns.map(column => {
                const content = container({
                    borders: true,
                    grow: 1,//TODO - change this if we allow a manual setting of column width
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
            })
        }
        
        return [];
    }

    const columnHeaderLayout = rowLayout({columnSize: "fixed"})(...getColumnHeaders());

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
        ...Array.from({ length: hasColumns ? 5 : 1 }).map(() => columnLayout));
}

export function getCustomCaption(values: AgGridPreviewProps): string {
    type DsProperty = { caption?: string };
    const dsProperty: DsProperty = datasource(values.gridData)().property ?? {};
    return dsProperty.caption || "AG Grid";
}