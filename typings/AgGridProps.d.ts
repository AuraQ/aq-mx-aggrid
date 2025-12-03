/**
 * This file was generated from AgGrid.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListAttributeValue, ListExpressionValue, ListWidgetValue } from "mendix";
import { Big } from "big.js";

export type ShowContentAsEnum = "attribute" | "dynamicText" | "customContent";

export type PinColumnEnum = "none" | "left" | "right";

export type LockColumnEnum = "none" | "left" | "right";

export interface ColumnsType {
    showContentAs: ShowContentAsEnum;
    attribute: ListAttributeValue<string | Big | any | boolean | Date>;
    caption: string;
    content?: ListWidgetValue;
    dynamicText?: ListExpressionValue<string>;
    allowEventPropagation: boolean;
    pinColumn: PinColumnEnum;
    lockColumn: LockColumnEnum;
    preventMoveColumn: boolean;
    canSort: boolean;
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
    preventMoveColumn: boolean;
    canSort: boolean;
}

export interface AgGridContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    gridData: ListValue;
    columns: ColumnsType[];
    enableMasterDetail: boolean;
    rowIsMaster: ListExpressionValue<boolean>;
    detailContent?: ListWidgetValue;
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
    columns: ColumnsPreviewType[];
    enableMasterDetail: boolean;
    rowIsMaster: string;
    detailContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    dynamicRowClasses: string;
    enableDarkTheme: string;
    licenceKey: string;
    logLevel: string;
}
