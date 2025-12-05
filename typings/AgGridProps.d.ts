/**
 * This file was generated from AgGrid.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListExpressionValue, ListWidgetValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type SelectionTypeEnum = "none" | "singleRow" | "multiRow";

export type SelectionMethodEnum = "checkbox" | "rowClick";

export type ShowContentAsEnum = "attribute" | "dynamicText" | "customContent";

export type PinColumnEnum = "none" | "left" | "right";

export type LockColumnEnum = "none" | "left" | "right";

export type CanReorderEnum = "default" | "true" | "false";

export type CanSortEnum = "default" | "true" | "false";

export type CanResizeEnum = "default" | "true" | "false";

export type WidthTypeEnum = "default" | "fixedWidth" | "flex";

export interface ColumnsType {
    showContentAs: ShowContentAsEnum;
    attribute: ListAttributeValue<string | Big | any | boolean | Date>;
    caption: string;
    content?: ListWidgetValue;
    dynamicText?: ListExpressionValue<string>;
    allowEventPropagation: boolean;
    pinColumn: PinColumnEnum;
    lockColumn: LockColumnEnum;
    canReorder: CanReorderEnum;
    canSort: CanSortEnum;
    canResize: CanResizeEnum;
    widthType: WidthTypeEnum;
    fixedWidth: number;
    flex: number;
    minWidth: number;
    maxWidth: number;
}

export interface ColumnsPreviewType {
    showContentAs: ShowContentAsEnum;
    attribute: string;
    caption: string;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    dynamicText: string;
    allowEventPropagation: boolean;
    pinColumn: PinColumnEnum;
    lockColumn: LockColumnEnum;
    canReorder: CanReorderEnum;
    canSort: CanSortEnum;
    canResize: CanResizeEnum;
    widthType: WidthTypeEnum;
    fixedWidth: number | null;
    flex: number | null;
    minWidth: number | null;
    maxWidth: number | null;
}

export interface AgGridContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    gridData: ListValue;
    selectionType: SelectionTypeEnum;
    selectionMethod: SelectionMethodEnum;
    singleSelectedAssociation?: ReferenceValue;
    multiSelectedAssociation?: ReferenceSetValue;
    columns: ColumnsType[];
    enableMasterDetail: boolean;
    rowIsMaster: ListExpressionValue<boolean>;
    detailContent?: ListWidgetValue;
    onSelectionChanged?: ActionValue;
    defaultSortable: boolean;
    defaultResizable: boolean;
    defaultReordable: boolean;
    dynamicRowClasses?: ListExpressionValue<string>;
    enableDarkTheme: DynamicValue<boolean>;
    licenceKey: DynamicValue<string>;
    logLevel: DynamicValue<string>;
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
    selectionType: SelectionTypeEnum;
    selectionMethod: SelectionMethodEnum;
    singleSelectedAssociation: string;
    multiSelectedAssociation: string;
    columns: ColumnsPreviewType[];
    enableMasterDetail: boolean;
    rowIsMaster: string;
    detailContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    onSelectionChanged: {} | null;
    defaultSortable: boolean;
    defaultResizable: boolean;
    defaultReordable: boolean;
    dynamicRowClasses: string;
    enableDarkTheme: string;
    licenceKey: string;
    logLevel: string;
}
