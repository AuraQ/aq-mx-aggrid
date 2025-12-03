import { AgGridPreviewProps } from "../../typings/AgGridProps";
import {datasource} from "./structure-utils";

export function getCustomCaption(values: AgGridPreviewProps): string {
    type DsProperty = { caption?: string };
    const dsProperty: DsProperty = datasource(values.gridData)().property ?? {};
    return dsProperty.caption || "AG Grid";
}