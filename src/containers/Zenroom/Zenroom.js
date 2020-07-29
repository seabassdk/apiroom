import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Hook, Console, Decode } from 'console-feed';
import ResizeableInputAceContainers from './resizeable/ResizeableInputAceContainers';

import * as actions from '../../store/actions/index';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import zenroom from 'zenroom';

const Zenroom = props => {

    const [executionTime, setExecutionTime] = useState(0);
    const [logs, setLogs] = useState([]);

    const clearResults = () => {
        props.onLogsChanged([]);
        props.onResultChanged([]);
    }

    useEffect(() => {
        if (props.execute) {

            const zenResult = [];

            const startTime = new Date();

            //save the result
            const printzenroom = (text) => { zenResult.push(text) }

            //Save any error
            const zenErrors = []
            const print_err_fn = (text) => { zenErrors.push(text) }

            //zenroom returns successfully
            const onSuccess = () => {
                const logs = zenErrors.length ? zenErrors : [];
                props.onLogsChanged(logs);

                const param = zenResult.length ? zenResult : []
                props.onResultChanged(param);

                const timeTaken = (new Date()) - startTime;
                setExecutionTime(timeTaken);
            }

            //zenroom returns with error
            const onError = () => {
                props.onLogsChanged([]);
                props.onResultChanged([{ error: 'Error detected. Execution aborted.' }]);
            }

            const options = {
                script: props.zencode,
                data: props.data,
                conf: null,
                keys: props.keys ? JSON.parse(props.keys) : null,
                print: printzenroom,
                print_err: print_err_fn,
                success: onSuccess,
                error: onError
            };

            //execute zenroom
            zenroom.init(options).zencode_exec();

            // set executing false
            props.onExecute(false);

        }

        
    }, [props]);

    return (
        <div className={"row m-0 p-0 justify-content-center flex-grow-1"}>
            <div className={'col-md-8 m-0 p-0'} style={{ padding: 0 }}>
                <ResizeableInputAceContainers
                    zencode={props.zencode}
                    zencodeChanged={props.onZencodeChanged}
                    keys={props.keys}
                    keysChanged={props.onKeysChanged}
                    data={props.data}
                    dataChanged={props.onDataChanged}
                    config={props.config}
                    configChanged={props.onConfigChanged}

                />
            </div>
            <div className={'col-md-4 m-0 p-0'} style={{ border: '2px solid #e8e8e8', padding: 0, marginBottom: 10 }}>
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
                                        {JSON.stringify(JSON.parse(result), null, '   ')}
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

                        <div style={{ marginTop: '50px', borderTop: '1px solid silver' }}>
                            <h5 style={{ color: 'red' }}>Logs:</h5>
                            <ul>
                                {props.logs.map((log, index) => {
                                    return (
                                        <li style={{ color: 'red' }} key={index}>
                                            {log}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

const mapStateToProps = state => {
    return {
        zencode: state.zenroom.zencode,
        keys: state.zenroom.keys,
        data: state.zenroom.data,
        config: state.zenroom.config,
        result: state.zenroom.result,
        logs: state.zenroom.logs,
        execute: state.zenroom.execute,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onZencodeChanged: (zencode) => dispatch(actions.changeZencode(zencode)),
        onKeysChanged: (keys) => dispatch(actions.changeKeys(keys)),
        onDataChanged: (data) => dispatch(actions.changeData(data)),
        onConfigChanged: (config) => dispatch(actions.changeConfig(config)),
        onResultChanged: (result) => dispatch(actions.changeResult(result)),
        onLogsChanged: (logs) => dispatch(actions.changeLogs(logs)),
        onErrorChanged: (error) => dispatch(actions.changeError(error)),
        onExecute: (executing) => dispatch(actions.changeExecute(executing)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Zenroom);