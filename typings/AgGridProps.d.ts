/**
 * This file was generated from AgGrid.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListAttributeValue, ListExpressionValue, ListWidgetValue } from "mendix";
import { Big } from "big.js";

export type ShowContentAsEnum = "attribute" | "dynamicText" | "customContent";

export interface ColumnsType {
    columnIdentifier: DynamicValue<string>;
    showContentAs: ShowContentAsEnum;
    attribute: ListAttributeValue<string | Big | any | boolean | Date>;
    caption: string;
    content?: ListWidgetValue;
    enableEditContent: boolean;
    editContent?: ListWidgetValue;
    dynamicText?: ListExpressionValue<string>;
    allowEventPropagation: boolean;
}

export interface ColumnsPreviewType {
    columnIdentifier: string;
    showContentAs: ShowContentAsEnum;
    attribute: string;
    caption: string;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    enableEditContent: boolean;
    editContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    dynamicText: string;
    allowEventPropagation: boolean;
}

export interface AgGridContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    gridData: ListValue;
    columns: ColumnsType[];
    showEditMode: DynamicValue<boolean>;
    dynamicRowClasses?: ListExpressionValue<string>;
}

export interface AgGridPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    gridData: {} | { caption: string } | { type: string } | null;
    columns: ColumnsPreviewType[];
    showEditMode: string;
    dynamicRowClasses: string;
}
