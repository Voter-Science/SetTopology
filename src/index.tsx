import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'

// declare var _sheetRef : any; // set by PluginMain, after page load.

export interface IMajorProps { }
export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _info: trcSheet.ISheetInfoResult;
    // Sheet Contents?  Sheet History? 

}

export class Major extends React.Component<{}, IMajorState> {

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
                return <div>Major: {this.state._info.Name}</div>
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
                this.setState({ _info: info });
            });
        });
    }
}


ReactDOM.render(
    <div>
        <Major></Major>
        <Hello compiler="TypeScript" framework="React" />
    </div>,
    document.getElementById("example")
);