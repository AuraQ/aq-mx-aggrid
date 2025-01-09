import {createElement, ReactElement, ReactNode} from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { ColumnsType } from 'typings/AgGridProps';

interface CellRendererParams extends CustomCellRendererProps {
    mxColumn: ColumnsType;
    showEditMode: boolean;
}

export default (params: CellRendererParams) => {
    console.debug("CellRendererParams", params);
    console.debug("Attribute",params.mxColumn.attribute?.get(params.data._mxObject));
    if(params.showEditMode && params.mxColumn.enableEditContent){
        return(
            <CustomContent allowEventPropagation={params.mxColumn.allowEventPropagation}>
                 {params.mxColumn.editContent?.get(params.data._mxObject)}
             </CustomContent>
        );
    }
    else{
        switch (params.mxColumn.showContentAs) {
            case "attribute":
            case "dynamicText": {
                return (
                    <span className="aggrid-text">
                        {params.mxColumn.showContentAs === "attribute"
                            ? params.mxColumn.attribute?.get(params.data._mxObject)?.displayValue
                            : params.mxColumn.dynamicText?.get(params.data._mxObject)?.value}
                    </span>
                );
            }
            case "customContent": {
                return(
                    <CustomContent allowEventPropagation={params.mxColumn.allowEventPropagation}>
                         {params.mxColumn.content?.get(params.data._mxObject)}
                     </CustomContent>
                );
            }
            default:
                throw new Error(`Unknown content type: ${params.mxColumn.showContentAs}`);
        }
    }
    

};

/* COPIED FROM DG2 to handle custom content rendering in cell */
const stopPropagation = (event: { stopPropagation(): void }): void => {
    event.stopPropagation();
};

const onKeyDown = (event: React.KeyboardEvent): void => {
    if (event.code === "Tab") {
        return;
    }

    event.stopPropagation();
};

function CustomContent({
    children,
    allowEventPropagation
}: {
    children: ReactNode;
    allowEventPropagation: boolean;
}): ReactElement {
    const wrapperProps: JSX.IntrinsicElements["div"] = allowEventPropagation
        ? {}
        : {
              onClick: stopPropagation,
              onKeyUp: stopPropagation,
              onKeyDown
          };

    return (
        <div className="aggrid-custom-content" {...wrapperProps}>
            {children}
        </div>
    );
}