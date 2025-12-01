import { createElement, ReactElement, ReactNode } from "react";

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

export function CustomContent({
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