// Wraps accessing a Sheet's info, contents, history, etc. 
// Exposes sheet info  to child elements. 

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'


// https://www.leighhalliday.com/introducing-react-context-api
// const AppContext = React.createContext( {});

// Replace this with a react context? 
declare var _trcGlobal : IMajorState;

export interface IMajorProps { 
    // children? : any;
    onReady : () => any; // render body when ready 
}
export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _updating : boolean;

    _info: trcSheet.ISheetInfoResult;
    // Sheet Contents?  Sheet History? 
}

export class SheetContainer extends React.Component<IMajorProps, IMajorState> {

    public constructor(props: any) {
        super(props);

        // Ordering:
        // - DOM has an html element 
        // - <SheetContainer> is rendered to that element. This sets the global
        // - Load complete.
        // - PluginMain() is called (after the OnLoad event). This reads the global
        //     to get <SheetContainer> and call setSheetRef();
        var x: any = window;
        x.mainMajor = this;
    }
    render() {
        if (!this.state) {
            return <div>Loading...</div>
        } else {
            if (this.state._updating) {
                return <div>Updating... please wait ...</div> 
            }
            if (!this.state._info) {
                return <div>Major! Not yet loaded: {this.state.SheetId}</div>;
            } else {
                // return <div>Major: {this.state._info.Name}</div>
                //return this.props.children;
                return this.props.onReady();
            }
        }
    }

    // Signal control will begin loading. 
    public  beginLoad() : void {
        this.setState({
            _updating : true 
        });
        // Will trigger a render. 
    }
    
    public check() : void {
        this.setState({
            _updating : false 
        });
        /*
        var adminClient = new trcSheet.SheetAdminClient(_trcGlobal.SheetClient);
        adminClient.WaitAsync().then( ()=> {


        }).catch( (err) => {

        });*/
    }
    
    // Called by PluginMain() once sheetId is available. 
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