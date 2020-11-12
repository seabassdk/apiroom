import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import ResizeableInputAceContainers from './resizeable/ResizeableInputAceContainers';
import ColumnResizer from "react-column-resizer";

import { hasJsonStructure } from '../../helpers/jsonHelper';

import * as actions from "../../store/actions/index";

import exampleContracts from '../../examples/zencodeExamples.json';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import { zenroom_exec, zencode_exec } from 'zenroom'

const Zenroom = (props) => {
  const [executionTime, setExecutionTime] = useState(0);

  const clearResults = () => {
    props.onLogsChanged(false);
    props.onResultChanged(false);
  };


  useEffect(() => {
    if (props.execute) {

      const options = {
        data: props.keys ? JSON.parse(JSON.stringify(props.data)) : null,
        conf: props.keys ? JSON.parse(JSON.stringify(props.config)) : null,
        keys: props.keys ? JSON.parse(JSON.stringify(props.keys)) : null,
      };

      const startTime = new Date();

      zencode_exec(props.zencode, options)
        .then(resObj => {
          const timeTaken = new Date() - startTime;
          setExecutionTime(timeTaken);

          let logs = resObj.logs.split('\n').map(log => {
            if (log.includes(' . ')) {
              return log.replace(' . ', '');
            }
            return log;
          });
          logs = logs.filter(log => log !== '');

          props.onResultChanged({
            success: true,
            msg: resObj.result,
            logs
          });
          
        })
        .catch(error => {
          let logs = error.logs.split('\n').map(log => {
            if (log.includes(' . ')) {
              return log.replace(' . ', '');
            }
            return log;
          });
          logs = logs.filter(log => log !== '');

          props.onResultChanged({
            success: false,
            msg: 'Something went wrong. Check logs.',
            logs
          });
        })

      // set executing false
      props.onExecute(false);

    }

  }, [props]);


  return (
    <div style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
      <table style={{ width: '100%', height: '100%', borderSpacing: '0px', tableLayout: 'fixed' }}>
        <tbody>
          <tr style={{ paddingTop: '5px' }}>
            <td style={{ width: '70%', height: '100%' }}>
              <ResizeableInputAceContainers
                zencode={props.zencode}
                zencodeChanged={props.onZencodeChanged}
                keys={props.keys}
                keysChanged={props.onKeysChanged}
                data={props.data}
                dataChanged={props.onDataChanged}
                config={props.config}
                configChanged={props.onConfigChanged}
                // loadContract={onLoadExampleContract}
                contracts={exampleContracts}
              />
            </td>
            <ColumnResizer className="columnResizer" />
            <td style={{ width: '29%', height: '100%', paddingLeft: '0px', overflow: 'hidden' }}>
              <div style={{ border: '2px solid #e8e8e8', padding: 0, height: '100%' }}>
                <div style={{ padding: '10px 17px' }}>
                  <h6 style={{ marginBottom: '30px' }}>Result:</h6>
                  <div>
                    {props.result && props.result.success
                      ? (<pre>
                        {hasJsonStructure(props.result.msg) && props.result ? JSON.stringify(JSON.parse(props.result.msg), null, '   ') : props.result.msg}
                      </pre>)
                      : (<div style={{ overflowWrap: 'break-word', color: 'red' }} >
                        {props.result.msg}
                      </div>)
                    }

                    {props.result && props.result.success && (
                      <div className={'d-flex justify-content-between mt-2'}>
                        <p><i>Executed in {executionTime} ms</i></p>
                        <div>
                          <button type="button" className={"btn btn-secondary btn-sm mr-3"} onClick={clearResults}>Clear</button>
                        </div>
                      </div>
                    )}

                  </div>

                  {props.result && props.result.logs && (
                    <Fragment>
                      <hr />
                      <div style={{ marginTop: '50px' }}>
                        <h6>Logs:</h6>
                        <ul>
                          {props.result.logs.map((log, index) => {
                            return (
                              <li style={log.includes('[W]') ? { color: 'orange' } : log.includes('[!]') ? { color: 'red' } : { color: 'black' }} key={index}>
                                {log}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zencode: state.zenroom.zencode,
    keys: state.zenroom.keys,
    data: state.zenroom.data,
    config: state.zenroom.config,
    result: state.zenroom.result,
    logs: state.zenroom.logs,
    execute: state.zenroom.execute,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onZencodeChanged: (zencode) => dispatch(actions.changeZencode(zencode)),
    onKeysChanged: (keys) => dispatch(actions.changeKeys(keys)),
    onDataChanged: (data) => dispatch(actions.changeData(data)),
    onConfigChanged: (config) => dispatch(actions.changeConfig(config)),
    onResultChanged: (result) => dispatch(actions.changeResult(result)),
    onLogsChanged: (logs) => dispatch(actions.changeLogs(logs)),
    onErrorChanged: (error) => dispatch(actions.changeError(error)),
    onExecute: (executing) => dispatch(actions.changeExecute(executing)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Zenroom);
