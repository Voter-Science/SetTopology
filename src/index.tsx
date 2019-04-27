import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

// declare var _sheetRef : any; // set by PluginMain, after page load.

export interface IMajorProps { }
export interface IMajorState {
    AuthToken: string;
    SheetId: string;
}

export class Major extends React.Component<{}, IMajorState> {
    public constructor(props: any) {
        super(props);
        // this.state = { SheetId: undefined };

        var x: any = window;
        x.mainMajor = this;
    }
    render() {
        return <h1>Major! {this.state.SheetId}</h1>;
    }

    // Timer to pick up _sheetRef? 

    public setSheetRef(sheetRef: any): void {
        // Make async network call...
        this.setState({ 
            SheetId: sheetRef.SheetId,
            AuthToken : sheetRef.AuthToken
        });
    }
}


ReactDOM.render(
    <p>
        <Major></Major>
        <Hello compiler="TypeScript" framework="React" />
    </p>,
    document.getElementById("example")
);