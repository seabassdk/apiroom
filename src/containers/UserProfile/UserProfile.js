import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import { Form, Table, Spinner, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-ambiance.js";
import "ace-builds/src-noconflict/mode-zencode";
import "ace-builds/src-noconflict/mode-json5";

import './UserProfile.css';
import * as actions from '../../store/actions/index';

import { hasJsonStructure } from '../../helpers/jsonHelper';

const PopoverContent = props => {
    const [contract, setContract] = useState(props.contract);
    const [fieldValue, setFieldValue] = useState(state =>
        props.mode === 'zencode'
            ? props.content
            : (props.content && hasJsonStructure(props.content))
                ? JSON.stringify(JSON.parse(props.content), null, '\t')
                : props.content
    );

    const onContractChange = (newValue) => {
        setContract(prevState => {

            let stateChange;
            switch (props.field) {
                case 'zencode':
                    stateChange = { zencode: newValue }
                    break;
                case 'keys':
                    stateChange = { keys: newValue }
                    break;
                case 'data':
                    stateChange = { data: newValue }
                    break;
                case 'config':
                    stateChange = { config: newValue }
                    break;
                default:
                    stateChange = {}
            };

            return { ...prevState, db: { ...prevState.db, ...stateChange }, ...stateChange };
        });
        setFieldValue(newValue);
    }

    useEffect(() => {
        setFieldValue(state => props.mode === 'zencode' ? props.content : (props.content && hasJsonStructure(props.content)) ? JSON.stringify(JSON.parse(props.content), null, '\t') : props.content)
    }, [props.content])

    return (
        <OverlayTrigger
            rootClose
            trigger="click"
            key={'bottom' + props.index}
            placement={'bottom'}
            overlay={
                <Popover id={`popover-positioned-bottom`}>
                    {/* <Popover.Title as="h3">{`Zencode`}</Popover.Title> */}
                    <div className={'d-flex justify-content-between popover-header'}>
                        <h5>{props.heading}</h5>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => props.updateField(contract)}>Save</button>
                    </div>
                    <Popover.Content>
                        <AceEditor
                            mode={props.mode}
                            theme="ambiance"
                            onChange={(newValue) => onContractChange(newValue)}
                            name="UNIQUE_ID_OF_DIV"
                            showPrintMargin={false}
                            width='500px'
                            value={fieldValue}
                        />
                    </Popover.Content>
                </Popover>
            }
        >
            {props.name
                ? (<a href="#" onClick={(e) => { e.preventDefault(); }}>{props.name}</a>)
                : props.content
                    ? (<a href="#" onClick={(e) => { e.preventDefault(); }}>show</a>)
                    : (<a href="#" onClick={(e) => { e.preventDefault(); }} style={{ color: 'red' }}>empty</a>)
            }

        </OverlayTrigger>
    );
}


const UserProfile = props => {
    const [exportContracts, setExportContracts] = useState({ contracts: [] });

    //go to edit screen with selected contract
    const loadContract = (name, zencode, keys, data, config, index) => {
        props.onLoadContract({ name, zencode, keys, data, config });
        props.onChangeUserLoaded(true);
        props.onSelectedIndex(index);
        props.history.push("/")
    }

    useEffect(() => {
        props.onChangeLoadingError(false);
        props.onLoadContracts();
    }, [props.username]);

    useEffect(() => {
        if (props.docker) {
            props.onDockerExport(false);
            props.onGetDocker(exportContracts)
        }
    }, [props.docker]);

    const onCheckedHandler = (e) => {
        let tmp = exportContracts.contracts;
        if (e.target.checked) {
            tmp.push(e.target.name);
            setExportContracts({ contracts: tmp });
        } else {
            tmp = tmp.filter(n => n !== e.target.name);
            setExportContracts({ contracts: tmp });
        }
    }

    return (
        <div className={'pb-5 user-contracts pt-5'} style={{ minHeight: '80vh' }}>
            {props.isLoading
                ? (<div>
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                </div>)
                : props.loadingError
                    ? <h4>{props.loadingError}</h4>

                    : (<Table responsive>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Zencode smart contract</th>
                                <th>Keys (-k)</th>
                                <th>Config (-c)</th>
                                <th style={{ color: '#6c757d' }}>
                                    <div>
                                        <OverlayTrigger
                                            trigger={['hover', 'focus']}
                                            placement='top'
                                            overlay={
                                                <Tooltip id='tooltip-top'>
                                                    <strong>What is stored in 'Data' will not be passed to the API, only what is stored in 'keys' is being used.</strong>.
                                                </Tooltip>
                                            }
                                        >
                                            <div> Data (-a)<sup><span>
                                                <img
                                                    src={require('../../assets/images/info.png')}
                                                    height="12"
                                                    alt="Zenroom logo"
                                                /></span></sup></div>
                                        </OverlayTrigger>
                                    </div>
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.contracts && props.contracts.map((contract, index) => {
                                return (<tr key={index}>
                                    <td><Form.Check aria-label="option 1" name={contract.db.file} onChange={e => onCheckedHandler(e)} /></td>
                                    <td>
                                        <div className="container display-menu-parent pl-0">
                                            <div className="row p-0 m-0">
                                                <div className="col pl-0">
                                                    <PopoverContent
                                                        name={contract.db.name}
                                                        content={contract.zencode}
                                                        mode={'zencode'}
                                                        heading={'Zencode'}
                                                        showTitle={false}
                                                        updateField={(contract) => props.onUpdateContractByIndex(contract, index)}
                                                        field={'zencode'}
                                                        contract={contract}
                                                        index={index}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row p-0 m-0">
                                                <div className="display-menu">
                                                    <div className="col pl-0">
                                                        <a onClick={() => loadContract(contract.db.name, contract.zencode, contract.keys, contract.db.data, contract.config, index)} href="#">Edit</a>
                                                        <a className="ml-3" href="#" style={{ color: 'red' }} onClick={() => props.onDeleteContractByIndex(index)}>Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <PopoverContent
                                            content={contract.keys}
                                            mode={'json5'}
                                            heading={'Keys'}
                                            updateField={(contract) => props.onUpdateContractByIndex(contract, index)}
                                            field={'keys'}
                                            contract={contract}
                                            index={index}
                                        />
                                    </td>
                                    <td>
                                        <PopoverContent
                                            content={contract.config}
                                            mode={'json5'}
                                            heading={'Config'}
                                            updateField={(contract) => props.onUpdateContractByIndex(contract, index)}
                                            field={'config'}
                                            contract={contract}
                                            index={index}
                                        />
                                    </td>
                                    <td>
                                        <PopoverContent
                                            content={contract.db.data}
                                            mode={'json5'}
                                            heading={'Data'}
                                            updateField={(contract) => props.onUpdateContractByIndex(contract, index)}
                                            field={'data'}
                                            contract={contract}
                                            index={index}
                                        />
                                    </td>
                                    <td>
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={'customSwitch1' + index}
                                                onChange={() => props.onSwitchContractByIndex(index)}
                                                checked={contract.switch === 'on' ? true : false} />
                                            <label className="custom-control-label" htmlFor={'customSwitch1' + index}>{contract.switch === 'on' ? 'On' : 'Off'}</label>
                                        </div>
                                    </td>
                                    <td>
                                        {/* <Link to={'/api/' + props.username + '/' + contract.db.file}>Link</Link> */}
                                        {contract.switch === 'on' &&
                                            <a href={'/api/' + props.username + '/' + contract.db.file} onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.open('/api/' + props.username + '/' + contract.db.file, "_blank")
                                            }}
                                            >Link</a>
                                        }
                                    </td>

                                </tr>)
                            })
                            }
                        </tbody>
                    </Table>)
            }

        </div >
    );

}

const mapStateToProps = state => {
    return {
        contracts: state.collections.contractCollection,
        isLoading: state.collections.isLoading,
        loadingError: state.collections.loadingError,
        username: state.auth.username,
        docker: state.zenroom.dockerExport
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // onLoadContracts: () => dispatch(actions.loadContracts())
        onLoadContracts: () => dispatch(actions.loadContracts()),
        onLoadContract: (contract) => dispatch(actions.changeContract(contract)),
        onChangeUserLoaded: (loaded) => dispatch(actions.changeUserLoaded(loaded)),
        onSelectedIndex: (index) => dispatch(actions.changeSelectedIndex(index)),
        onUpdateContractByIndex: (contract, index) => dispatch(actions.updateContractByIndex(contract, index)),
        onDeleteContractByIndex: (index) => dispatch(actions.deleteContractByIndex(index)),
        onChangeLoadingError: (error) => dispatch(actions.changeLoadingError(error)),
        onSwitchContractByIndex: (index) => dispatch(actions.switchContractByIndex(index)),
        onDockerExport: (docker) => dispatch(actions.changeDockerExport(docker)),
        onGetDocker: (contracts) => dispatch(actions.getDocker(contracts)),
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));