import { ReactElement, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

//import { AgGridContainerProps } from "../typings/AgGridProps";

import "./ui/AgGrid.css";
//props: AgGridContainerProps
export function AgGrid(): ReactElement {
    return <HelloWorldSample sampleText={"Hello World"} />;
}
