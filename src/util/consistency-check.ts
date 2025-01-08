import { AgGridPreviewProps, ColumnsPreviewType } from "typings/AgGridProps";
import { Problem } from "../AgGrid.editorConfig";

export function check(values: AgGridPreviewProps): Problem[] {
    const errors: Problem[] = [];
    
    values.columns.forEach((column: ColumnsPreviewType, index) => {                
        const regex = /^[\w\-_$]+$/;
        const identifierValue = column.columnIdentifier.substring(1,column.columnIdentifier.length-2); // dynamic text so have to remove outer quotes
        if(!regex.test(identifierValue)){
             errors.push({property: `columns/${index + 1}/columnIdentifier`,severity: "error", message:`Column Identifier can only contain numbers, letters, dashes, underscores or dollar symbols.`})
        }
    });

    if(columnsHaveDuplicateIdentifer(values.columns)){
        errors.push({property: "columns",severity: "error", message:"Column Identifier must be unique"})
    }
    return errors;
}

function columnsHaveDuplicateIdentifer(columns : ColumnsPreviewType[]){
    // create a set that ensures uniqueness in values
    const columnSet = new Set(columns.map((column)=>column.columnIdentifier));

    // if our set size doesn't match our columns then we have a duplicate somewhere
    return columnSet.size !== columns.length;
}