import React from 'react';
import { slideDown, slideUp } from './anim';
import './style.css';

// An expandable table row that wraps and displays data for one block
class BlockTableRow extends React.Component {

  // initial state of each raw data row is to be collapsed
  state = { expanded: false }  

  // event handler for row click
  toggleExpander = (e) => {

    //toggles expanded row, which shows raw block data
    if (!this.state.expanded) {
      //if row not expanded, then expand
      this.setState(
        { expanded: true },
        () => {
          //transition effect
          if (this.refs.expanderBody) {
            slideDown(this.refs.expanderBody);
          }
        }
      );
    } else {
      //if row expanded, then collapse

      //transition effect
      slideUp(this.refs.expanderBody, {
        onComplete: () => { this.setState({ expanded: false }); }
      });
    }
  }

  render() {
    const { block } = this.props;
    const { index } = this.props;

    {/* Return a rendered table row showing block data */}
    {/* Raw block contents is not visible unless row has been toggled by user click */}
    return [
          <tr key={index} index={index} onClick={this.toggleExpander} data-cy={"row" + index}>
            <td>
              {/* block id, timestamp, and action count should be visible at all times */}
              <div data-cy="block-headers">
                  block id: <span data-cy={"block-id"}>{block.id}</span><br />
                  timestamp: <span data-cy={"timestamp"}>{block.ts}</span><br />
                  action count: <span data-cy={"action-count"}>{block.action_count} </span><br />
              </div>
            </td>
          </tr>,
          this.state.expanded && ( 
            <tr index={index} className="expandable" key="tr-expander" data-cy={"expanded-row" + index}>
              <td className="uk-background-muted">
                <div ref="expanderBody" className="inner uk-grid" class="scrollable" data-cy="raw-block">
                    {JSON.stringify(block.raw_contents, null, 2)}
                </div>
              </td>
            </tr>
          )
      ];
  }
}

export default BlockTableRow;
