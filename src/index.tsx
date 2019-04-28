import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'
import { checkPropTypes } from "prop-types";


import { ColumnSelector } from "./components/ColumnSelector";
import { Major } from './components/SheetContainer'

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

ReactDOM.render(
    <div>
        <Major>
            The current sheet is: <SheetName />
            <ColumnSelector OnChange={(e) => alert(e.Name)} />
        </Major>

        <Hello compiler="TypeScript" framework="React" />
    </div>,
    document.getElementById("example")
);