import * as React from "react";
import * as ReactDOM from "react-dom";

import { SheetContainer, IMajorState } from "trc-react/dist/SheetContainer";
import TRCContext from "trc-react/dist/context/TRCContext";
import { PluginShell } from "trc-react/dist/PluginShell";
import { Panel } from "trc-react/dist/common/Panel";
import { Copy } from "trc-react/dist/common/Copy";
import { HorizontalList } from "trc-react/dist/common/HorizontalList";
import { Button } from "trc-react/dist/common/Button";

import * as trcSheet from "trc-sheet/sheet";

import { ColumnSelector } from "./components/ColumnSelector";

import * as bcl from "trc-analyze/collections";

// Display the current sheet name
export class SheetName extends React.Component<{}, {}> {
  static contextType = TRCContext;

  render() {
    return <b>Major: {this.context._info.Name}</b>;
  }
}

// List
export class ListData extends React.Component<
  {
    children?: any; // Banner, only display if we have items
    items: string[];
  },
  {}
> {
  render() {
    if (this.props.items.length == 0) {
      return null;
    }

    return (
      <Copy>
        <p>{this.props.children}</p>
        <ul>
          {this.props.items.map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      </Copy>
    );
  }
}

//
export class App extends React.Component<
  {},
  {
    columnInfo: trcSheet.IColumnInfo;
    shardValues: string[];
  }
> {
  static contextType = TRCContext;

  public constructor(props: any, context: any) {
    super(props, context);

    this.state = { columnInfo: undefined, shardValues: [] };
    this.renderBody = this.renderBody.bind(this);
    this.handle = this.handle.bind(this);
    this.setOption = this.setOption.bind(this);
    this.getTopology = this.getTopology.bind(this);
  }
  // undefined in no topology
  private getTopology(): string {
    var y = this.context._info.Topology;
    if (!y) {
      return undefined;
    }
    return y.AutoCreateChildrenForColumnName;
  }

  private setOption(ci: trcSheet.IColumnInfo): void {
    // Get # of uniques
    var vals = this.context._contents[ci.Name];
    var counter = new bcl.HashCount();
    vals.map((x: any) => counter.Add(x));

    this.setState({
      shardValues: counter.getKeys(),
      columnInfo: ci,
    });
  }
  private handle() {
    // Call Long running op
    // Disable for running

    var x: any = window;
    x.mainMajor.beginLoad();

    var topology: trcSheet.IMaintenanceSetTopology = {
      Topology: {
        AutoCreateChildrenForColumnName: this.state.columnInfo.Name,
      },
    };

    var adminClient = new trcSheet.SheetAdminClient(this.context.SheetClient);
    adminClient
      .postOpSetTopologyAsync(topology)
      .then(() => {
        // 202 polling finished. Sheet is updated.
        x.mainMajor.checkManagedmentOp();
      })
      .catch((err) => {
        // $$$ Can we catch this via ReactDOM error handling?
        alert(JSON.stringify(err));
      });
  }

  // Tips on conditional rendering: https://reactjs.org/docs/conditional-rendering.html

  renderTopology() {
    return (
      <>
        <Copy>
          <p>
            This sheet does not have a current topology. Please select a column
            to split by:
          </p>
        </Copy>
        <HorizontalList>
          <ColumnSelector
            Include={(ci) => ci.IsReadOnly && ci.Name != "RecId"}
            Value={this.state.columnInfo}
            OnChange={(e) => this.setOption(e)}
          />
          <Button onClick={this.handle} disabled={!this.state.columnInfo}>
            Set Topology
          </Button>
        </HorizontalList>
        <ListData items={this.state.shardValues}>
          This field has {this.state.shardValues.length} unique values:
        </ListData>
      </>
    );
  }
  renderInput() {
    return (
      <div>
        This sheet's current topology is to split by <b>{this.getTopology()}</b>
        .
      </div>
    );
  }

  // Called when the sheet has loaded.
  renderBody() {
    return (
      <Panel>
        <Copy>
          <p>
            The current sheet is: <SheetName />
          </p>
        </Copy>
        {this.getTopology() ? this.renderInput() : this.renderTopology()}
      </Panel>
    );
  }

  render() {
    return (
      <PluginShell
        description={<p>This plugin lets you view and set the 'topology'.</p>}
        title="SetTopology"
      >
        {this.renderBody()}
      </PluginShell>
    );
  }
}

ReactDOM.render(
  <SheetContainer fetchContents={true} requireTop={true}>
    <App />
  </SheetContainer>,
  document.getElementById("example")
);
