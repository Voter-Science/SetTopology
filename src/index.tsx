import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'
import { checkPropTypes } from "prop-types";


import { ColumnSelector } from "./components/ColumnSelector";
import { SheetContainer } from './components/SheetContainer'

export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _info: trcSheet.ISheetInfoResult;
    // Sheet Contents?  Sheet History? 
}
declare var _trcGlobal : IMajorState;


// Display the current sheet name 
export class SheetName extends React.Component<{}, {}> {
    render() {        
            return <div>Major: {_trcGlobal._info.Name}</div>            
    }
}

// 
export class App extends React.Component<{},{
    columnInfo : trcSheet.IColumnInfo
}>
{
    public constructor(props : any) {
        super(props);

        this.state = { columnInfo : undefined };
        this.renderBody = this.renderBody.bind(this);
        this.handle = this.handle.bind(this);
    }
    // undefined in no topology 
    private getTopology() : string {
        var x : any = _trcGlobal._info;
        var y = x.Topology;
        if (!y) { return undefined; }
        return y.AutoCreateChildrenForColumnName;
    }

    private setOption(ci : trcSheet.IColumnInfo) : void {
        this.setState(
            {
                columnInfo:  ci
            }
        );
    }
    private handle() {
        alert("Activate: " + this.state.columnInfo.Name);

        // Call Long running op
        // Disable for running

        var x: any = window;
        x.mainMajor.beginLoad();

        setTimeout( ()=> {
            x.mainMajor.check();
        }, 3000);

        /*
        var adminClient = new trcSheet.SheetAdminClient(_trcGlobal.SheetClient);
        adminClient.postOpRefreshAsync().then( ()=> {
            // 202 polling finished. Sheet is updated. 
        });*/

    }

    renderTopology() {
        return <div>
            This sheet does not have a current topology. Please select a column to split by:
<ColumnSelector  Include={ (ci) => ci.IsReadOnly && ci.Name != "RecId" }
OnChange={(e) => this.setOption(e)} />

            <button onClick={this.handle} disabled={!this.state.columnInfo}>Set Toplogy</button>
        </div>
    }
    renderInput() {
        return <div>
            This sheet's current topology is to split by <b>{this.getTopology()}</b>.
        </div> 
    }

    // Called when the sheet has loaded. 
    renderBody() {
return  <div> The current sheet is: <SheetName />
        { this.getTopology() ? this.renderInput() : this.renderTopology() }    </div>
    }


    render() {
        return <div>
            <p>This plugin helps with topology.</p>
            <SheetContainer onReady={this.renderBody}></SheetContainer>
        </div> 

    };
}

ReactDOM.render(
    <div>
        <App></App>
    </div>,
    document.getElementById("example")
);