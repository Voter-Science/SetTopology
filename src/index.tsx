import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'
import { checkPropTypes } from "prop-types";

// https://www.leighhalliday.com/introducing-react-context-api
// const AppContext = React.createContext( {});

// Replace this with a react context? 
var _trcGlobal : IMajorState;
declare var _trcGlobal : IMajorState;

// Display the current sheet name 
export class SheetName extends React.Component<{}, {}> {
    render() {        
            return <div>Major: {_trcGlobal._info.Name}</div>            
    }
}

export interface IMajorProps { 
    children? : any;
}
export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _info: trcSheet.ISheetInfoResult;
    // Sheet Contents?  Sheet History? 

}

export class Major extends React.Component<IMajorProps, IMajorState> {

    public constructor(props: any) {
        super(props);

        var x: any = window;
        x.mainMajor = this;
    }
    render() {
        if (!this.state) {
            return <div>Loading...</div>
        } else {
            if (!this.state._info) {
                return <div>Major! Not yet loaded: {this.state.SheetId}</div>;
            } else {
                // return <div>Major: {this.state._info.Name}</div>
                return this.props.children;
            }
        }
    }

    // Timer to pick up _sheetRef? 

    public setSheetRef(sheetRef: any): void {
        var httpClient = XC.XClient.New(sheetRef.Server, sheetRef.AuthToken, undefined);
        var sheetClient = new trcSheet.SheetClient(httpClient, sheetRef.SheetId);

        // Make async network call...
        this.setState({
            SheetId: sheetRef.SheetId,
            SheetClient: sheetClient
        }, () => {
            // State is updated 
            
            this.state.SheetClient.getInfoAsync().then((info) => {                
                _trcGlobal = {
                    ...this.state,                    
                };
                _trcGlobal._info = info;
                this.setState({ _info: info });
            });
        });
    }
}


ReactDOM.render(
    <div>
        <Major>
            The current sheet is: <SheetName />
        </Major>
        <Hello compiler="TypeScript" framework="React" />
    </div>,
    document.getElementById("example")
);