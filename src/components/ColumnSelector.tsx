import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'

// $$$ Share this wiht main 
export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _info: trcSheet.ISheetInfoResult;
    // Sheet Contents?  Sheet History? 
}
declare var _trcGlobal : IMajorState;


// Select a column name from the sheet. 
export interface IColumnSelectorProps {
    // Add props to restrict selection (Predicate on ColumnInfo?)
    OnChange : (ci : trcSheet.IColumnInfo) => void; // CAlled when a selection is made
}
export class ColumnSelector extends React.Component<IColumnSelectorProps, {}> {
    constructor(props : any) {
        super(props);
        this.state = { };    
        this.handleChange = this.handleChange.bind(this);
      }

    private getValues() : string[] {
        var cs = _trcGlobal._info.Columns;
        return cs.map(c => c.Name);
    }

    handleChange(event: any) {
        var idx = event.target.value;
        //alert("set: " + idx);
        // this.setState({value: event.target.value});
        var ci = _trcGlobal._info.Columns[idx];
        this.props.OnChange(ci);
      }

    render() {        
         return <select onChange={this.handleChange}>
             {this.getValues().map((name,idx) => <option value={idx}>{name}</option>)}
         </select>   
    }
}
