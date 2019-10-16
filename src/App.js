import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { JsonRpc } from 'eosjs';
import BlockTableRow from './BlockTableRow';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [trigger, setTrigger] = useState(false)

  async function getBlocks() {
    
    if(!trigger) return;

    const rpc = new JsonRpc('https://api.eosnewyork.io');
    const info = await rpc.get_info();
    const head_block_num = info.head_block_num;
    let new_blocks = [];

    for(let i = head_block_num; i > (head_block_num - 10); i--)
    {
      const block_info = await rpc.get_block(i);
      new_blocks.push({
        'block_number': i,
        'ts': block_info.timestamp,
        'id': block_info.id,
        'action_count': block_info.transactions.length,
        'raw_contents': JSON.stringify(block_info)
      });
    }

    setTrigger(false);
    setBlocks(new_blocks);
  }
  
  useEffect(() => {
    getBlocks();
  });
      
  return (
     
     <main>
        <button value="LOAD" onClick={() => setTrigger(!trigger)} data-cy="load">Load Blocks</button>
        <h1> Block List</h1>
        <div className="table-container">
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-hover uk-table-middle uk-table-divider" data-cy="table">
              <tbody>
                {blocks.map((block, index) => {
                  return(
                    <BlockTableRow key={index} index={index + 1} block={block} />
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }

ReactDOM.render(<App />, document.getElementById('root'));

export default App;