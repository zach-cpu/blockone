import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { JsonRpc } from 'eosjs';
import BlockTableRow from './BlockTableRow';

function App() {
  const [blocks, setBlocks] = useState([]);
  //trigger for loading blocks is initially set to false, so that page will not load blocks on page load
  const [trigger, setTrigger] = useState(false)

  //getBlocks retrieves up to 10 of the newest blocks from the blockchain
  async function getBlocks() {
    
    // avoid calling this function until "Load" button is pressed
    // I feel like this is a clumsy way to implement a "no initial load" behavior
    if(!trigger) return;

    // Create an rpc object for NY blockchain
    const rpc = new JsonRpc('https://api.eosnewyork.io');
    // get blockchain info, e.g. head block number
    const info = await rpc.get_info();
    const head_block_num = info.head_block_num;
    let new_blocks = [];

    /* Retrieve data from up to the 10 newest blocks in the blockchain
    */
    for(let i = head_block_num; i > (head_block_num - 10); i--)
    {
      const block_info = await rpc.get_block(i);
      new_blocks.push({
        'block_number': i, //block number
        'ts': block_info.timestamp, //block timestamp
        'id': block_info.id, //block id - hash value
        'action_count': block_info.transactions.length, //count of transactions against the block
        'raw_contents': JSON.stringify(block_info) //raw block contents (all info)
      });
    }

    //set trigger so the "Load" button can be clicked again to load newer blocks
    setTrigger(false);
    //update App state with newly read blocks
    setBlocks(new_blocks);
  }
  
  //on App load, get blocks
  useEffect(() => {
    getBlocks();
  });
      
  return (
     
     <main>
       {/* Load button  */}
        <button value="LOAD" onClick={() => setTrigger(!trigger)} data-cy="load">Load Blocks</button>
        <h1> Block List</h1>
        <div className="table-container">
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-hover uk-table-middle uk-table-divider" data-cy="table">
              <tbody>
                {/* Bind each block to a BlockTableRow object */}
                {/* Set keys and indices for test automation code to read */}
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
