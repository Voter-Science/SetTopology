import * as React from "react";
import * as ReactDOM from "react-dom";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'
import { checkPropTypes } from "prop-types";


import { ColumnSelector } from "./components/ColumnSelector";
import { SheetContainer, IMajorState } from './components/SheetContainer'

import * as bcl from  'trc-analyze/collections'

declare var _trcGlobal : IMajorState;


// Display the current sheet name 
export class SheetName extends React.Component<{}, {}> {
    render() {        
            return <div>Major: {_trcGlobal._info.Name}</div>            
    }
}

// List 
export class ListData extends React.Component<{
    children? :any, // Banner, only display if we have items
    items : string[]
}, {}> {
    render() {     
        if (this.props.items.length == 0)   
        {
            return null;
        }
        
        return  <div>
            {this.props.children} 
            <ul>
                {this.props.items.map((x,idx) => <li key={idx}>{x}</li>)}
            </ul>
            </div>  
    }
}

// 
export class App extends React.Component<{},{
    columnInfo : trcSheet.IColumnInfo,
    shardValues : string[]
}>
{
    public constructor(props : any) {
        super(props);

        this.state = { columnInfo : undefined, shardValues : [] };
        this.renderBody = this.renderBody.bind(this);
        this.handle = this.handle.bind(this);
    }
    // undefined in no topology 
    private getTopology() : string {
        var y  = _trcGlobal._info.Topology;
        if (!y) { return undefined; }
        return y.AutoCreateChildrenForColumnName;
    }

    private setOption(ci : trcSheet.IColumnInfo) : void {
        // Get # of uniques 
        var vals = _trcGlobal._contents[ci.Name];
        var counter = new bcl.HashCount();
        vals.map(x => counter.Add(x));
                

        this.setState(
            {
                shardValues : counter.getKeys(),
                columnInfo:  ci
            }
        );
    }
    private handle() {
        // alert("Activate: " + this.state.columnInfo.Name);

        // Call Long running op
        // Disable for running

        var x: any = window;
        x.mainMajor.beginLoad();

        /*
        setTimeout( ()=> {
            x.mainMajor.check();
        }, 3000);
        */
        var topology : trcSheet.IMaintenanceSetTopology = {
            Topology : {
                AutoCreateChildrenForColumnName : this.state.columnInfo.Name
                }
        };
        
       
        var adminClient = new trcSheet.SheetAdminClient(_trcGlobal.SheetClient);
        adminClient.postOpSetTopologyAsync(topology).then( ()=> {
            // 202 polling finished. Sheet is updated. 
            x.mainMajor.checkManagedmentOp();
        }).catch( (err) => {
            // $$$ Can we catch this via ReactDOM error handling?
            alert (JSON.stringify(err));
        });

    }

    // Tips on conditional rendering: https://reactjs.org/docs/conditional-rendering.html

    renderTopology() {
        return <div>
            This sheet does not have a current topology. Please select a column to split by:
<ColumnSelector  
    Include={ (ci) => ci.IsReadOnly && ci.Name != "RecId" }
    Value={this.state.columnInfo}
    OnChange={(e) => this.setOption(e)} />

            <ListData items={this.state.shardValues}>
                This field has {this.state.shardValues.length} unique values:
            </ListData>
            
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
            <p>This plugin lets you view and set the 'topology'.</p>
            <SheetContainer 
                onReady={this.renderBody}                 
                fetchContents={true}
                requireTop ={true}>
            </SheetContainer>
        </div> 

    };
}

ReactDOM.render(
    <div>
        <App></App>
    </div>,
    document.getElementById("example")
);