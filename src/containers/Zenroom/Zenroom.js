import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import ResizeableInputAceContainers from './resizeable/ResizeableInputAceContainers';
import ColumnResizer from "react-column-resizer";

import { hasJsonStructure } from '../../helpers/jsonHelper';

import * as actions from "../../store/actions/index";

import exampleContracts from '../../examples/zencodeExamples.json';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import zenroom from "zenroom";

const Zenroom = (props) => {
  const [executionTime, setExecutionTime] = useState(0);
  const [logs, setLogs] = useState([]);

  const clearResults = () => {
    props.onLogsChanged([]);
    props.onResultChanged([]);
  };


  useEffect(() => {
    if (props.execute) {
      const zenResult = [];
      const zenErrors = [];
      const startTime = new Date();

      //save the result
      const print = (text) => {
        zenResult.push(text);
      };

      //Save any error
      const print_err = (text) => {
        zenErrors.push(text);
      };

      //zenroom returns successfully
      const onSuccess = () => {
        props.onLogsChanged(zenErrors);
        props.onResultChanged(zenResult);

        const timeTaken = new Date() - startTime;
        setExecutionTime(timeTaken);
      };

      //zenroom returns with error
      const onError = () => {
        props.onResultChanged([
          { error: "Error detected. Execution aborted." },
        ]);
        props.onLogsChanged(zenErrors);
      };

      const options = {
        script: props.zencode,
        data: props.data,
        conf: props.config,
        keys: props.keys ? JSON.parse(props.keys) : null,
        print: print,
        print_err: print_err,
        success: onSuccess,
        error: onError,
      };

      //execute zenroom
      zenroom.init(options).zencode_exec();

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
              {/* <div style={{width: '70%', padding: 0, display: 'inline-block' }}> */}
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
              {/* </div> */}
            </td>
            <ColumnResizer className="columnResizer" />
            <td style={{ width: '29%', height: '100%', paddingLeft: '0px', overflow: 'hidden' }}>
              {/* <div style={{width: '30%', height: '100%', display: 'inline-block'}}> */}
              <div style={{ border: '2px solid #e8e8e8', padding: 0, height: '100%' }}>
                <div style={{ padding: '10px 17px' }}>
                  <h6 style={{ marginBottom: '30px' }}>Result:</h6>
                  <div>
                    {props.result.length > 0 && props.result.map((result, index) => {

                      let displayResult = result.error
                        ? (<div style={{ overflowWrap: 'break-word', color: 'red' }} key={index}>
                          {result.error}
                        </div>)
                        : (<div key={index}>
                          <pre>
                            {hasJsonStructure(result) && result ? JSON.stringify(JSON.parse(result), null, '   ') : result}
                          </pre>
                        </div>)
                      return displayResult;

                    })}

                    {props.result.length > 0 && (
                      <div className={'d-flex justify-content-between mt-2'}>
                        <p><i>Executed in {executionTime} ms</i></p>
                        <div>
                          <button type="button" className={"btn btn-secondary btn-sm mr-3"} onClick={clearResults}>Clear</button>
                        </div>
                      </div>
                    )}

                  </div>

                  {props.logs.length > 0 && (
                    <Fragment>
                      <hr />
                      <div style={{ marginTop: '50px' }}>
                        <h6>Logs:</h6>
                        <ul>
                          {props.logs.map((log, index) => {
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
                {/* </div> */}
                {/* here is the parent */}
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
