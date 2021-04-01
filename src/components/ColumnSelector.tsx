import * as React from "react";
import * as trcSheet from "trc-sheet/sheet";

import TRCContext from "trc-react/dist/context/TRCContext";
import { SelectInput } from "trc-react/dist/common/SelectInput";

// $$$ Share this with main
export interface IMajorState {
  //AuthToken: string;
  SheetClient: trcSheet.SheetClient;
  SheetId: string;

  _info: trcSheet.ISheetInfoResult;
  // Sheet Contents?  Sheet History?
}

// Select a column name from the sheet.
export interface IColumnSelectorProps {
  // Optional predicate to restrict which columns are included
  Include?: (ci: trcSheet.IColumnInfo) => boolean;
  Value?: string | trcSheet.IColumnInfo; // Initial value

  OnChange: (ci: trcSheet.IColumnInfo) => void; // Called when a selection is made
}
export class ColumnSelector extends React.Component<IColumnSelectorProps, {}> {
  static contextType = TRCContext;

  constructor(props: any, context: any) {
    super(props, context);
    if (!props.Include) {
      props.Include = (ci: any) => true;
    }
    this.state = {};
    this.getValues = this.getValues.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  private getValues(): string[] {
    var cs = this.context._info.Columns;
    return cs.map((c: any) => (this.props.Include(c) ? c.Name : null));
  }

  // Used for selecting the "props.Value" item.
  // value is an index into columnInfo array
  private getValue(): number {
    if (!this.props.Value) {
      return undefined;
    }

    // props may be the name or the columnInfo. Convert to name
    var x: any = this.props.Value;
    var name: string = x.Name ? x.Name : x;

    var cs = this.getValues();
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      if (c) {
        // skip nulls
        if (c == name) {
          return i;
        }
      }
    }

    return undefined;
  }

  handleChange(event: any) {
    var idx = event.target.value;
    var ci = this.context._info.Columns[idx];

    this.props.OnChange(ci);
  }

  render() {
    const names = this.getValues().filter(Boolean);
    const values = this.getValues()
      .map((name, index) => name && index)
      .filter(Boolean);

    return (
      <SelectInput
        onChange={this.handleChange}
        value={this.getValue()}
        options={names}
        values={values}
      />
    );
  }
}
