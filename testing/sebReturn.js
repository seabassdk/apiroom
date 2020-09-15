<div style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
<table style={{width: '100%', height: '100%', borderSpacing: '0px', tableLayout: 'fixed'}}>
    <tbody>
        <tr style={{paddingTop: '5px'}}>
            <td style={{width: '70%', height: '100%'}}>
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
                    loadContract={onLoadExampleContract}
                    contracts={exampleContracts}
                />
                {/* </div> */}
            </td>
            <ColumnResizer className="columnResizer"/>
            <td style={{width: '29%', height: '100%', paddingLeft: '0px', overflow: 'hidden'}}>
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
                    {/* </div> */}
                    {/* here is the parent */}
                </div>
            </td>
        </tr>
    </tbody>
</table>
</div>
</div>
</div>