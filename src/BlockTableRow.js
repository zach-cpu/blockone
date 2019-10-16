import React from 'react';
import { slideDown, slideUp } from './anim';
import './style.css';

class BlockTableRow extends React.Component {

  state = { expanded: false }  

  toggleExpander = (e) => {

    if (!this.state.expanded) {
      this.setState(
        { expanded: true },
        () => {
          if (this.refs.expanderBody) {
            slideDown(this.refs.expanderBody);
          }
        }
      );
    } else {
      slideUp(this.refs.expanderBody, {
        onComplete: () => { this.setState({ expanded: false }); }
      });
    }
  }

  render() {
    const { block } = this.props;
    const { index } = this.props;

    return [
          <tr key={index} index={index} onClick={this.toggleExpander} data-cy={"row" + index}>
            <td>
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