import { createElement, ReactNode } from "react";
import { CustomContent } from "./CustomContent";

export interface DetailCellRendererParams {
    detailContent : ReactNode | null;
}

export function DetailCellRenderer(params : DetailCellRendererParams) {
    return <CustomContent allowEventPropagation={false}>{params.detailContent}</CustomContent>;
}
