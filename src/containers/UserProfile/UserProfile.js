import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import { Form, Table, Spinner, OverlayTrigger, Popover, Button, Tooltip, Row } from 'react-bootstrap';

import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-ambiance.js";
import "ace-builds/src-noconflict/mode-zencode";
import "ace-builds/src-noconflict/mode-json5";

import './UserProfile.css';
import { loadContractsUri } from '../../constants/api';
import * as actions from '../../store/actions/index';

import { hasJsonStructure } from '../../helpers/jsonHelper';

const PopoverContent = props => {
    // const startValue = (props.mode === 'zencode') ? props.content : (props.content && hasJsonStructure(props.content)) ? JSON.stringify(JSON.parse(props.content), null, '\t') : props.content
    const [contract, setContract] = useState(props.contract);
    const [fieldValue, setFieldValue] = useState(state => props.mode === 'zencode' ? props.content : (props.content && hasJsonStructure(props.content)) ? JSON.stringify(JSON.parse(props.content), null, '\t') : props.content);

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
    const { userContracts } = useSelector(state => state.zenroom);
    const [tableEmpty, setTableEmpty] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [exportContracts, setExportContracts] = useState({ contracts: [] });

    //go to edit screen with selected contract
    const loadContract = (name, zencode, keys, data, config, index) => {
        props.onLoadContract({ name, zencode, keys, data, config });
        props.onChangeUserLoaded(true);
        props.onSelectedIndex(index);
        props.history.push("/")

    }

    const onUpdateContractByIndexHandler = (contract, index) => {
        console.log('The window scroll position: ' + window.pageYOffset);
        props.onUpdateContractByIndex(contract, index);


    }

    useEffect(() => {
        props.onChangeLoadingError(false);
        props.onLoadContracts();
    }, []);

    useEffect(() => {
        if (props.docker) {
            console.log('EXPORT DOCKER!');
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

    useEffect(() => {
        console.log('new export state:');
        console.log(exportContracts);
    }, [exportContracts]);

    // useEffect(() => {
    //     console.log('USEEFFECT FIRING LOCATION STATE: ');
    //     if(props.location.state && props.location.state.updated) {
    //         console.log('not null: ' + props.location.state.updated);
    //         props.onChangeLoadingError(false);
    //         props.onLoadContracts();
    //     }
    // }, [props.location.state]);

    // useEffect(() => {

    //     if (!props.contracts.length) {
    //         props.onLoadContracts();
    //     } else {
    //         setTableEmpty(false);
    //     }
    // }, [props.contracts]);

    return (
        <div className={'pb-5 user-contracts pt-5'} style={{ minHeight: '80vh' }}>
            {/* <h4 className={'mt-5'}>Saved Contracts</h4> */}

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
                                <th className="pl-5">Zencode smart contract</th>
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
                                {/* <th></th> */}
                                <th></th>
                                <th></th>
                                <th>Export</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.contracts && props.contracts.map((contract, index) => {
                                return (<tr key={index}>

                                    <td className="pl-5">
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
                                    {/* <td>
                                        <a onClick={() => loadContract(contract.db.name, contract.zencode, contract.keys, contract.db.data, contract.config, index)} style={{ color: 'black', cursor: 'pointer' }}>Edit</a>
                                    </td> */}
                                    <td>
                                        {/* <button type="button" className="btn btn-outline-dark" style={{ height: '1.375rem', lineHeight: '0.5', padding: '.375rem .55rem', marginRight: '2px' }}>Edit</button>
                                    <button type="button" className="btn btn-outline-dark" style={{ height: '1.375rem', lineHeight: '0.5', padding: '.375rem .55rem' }}>Swagger</button> */}
                                        <BootstrapSwitchButton
                                            onlabel='ON'
                                            offlabel='OFF'
                                            checked={contract.switch === 'on' ? true : false}
                                            onstyle="outline-success"
                                            offstyle="outline-warning"
                                            height='3'
                                            size='xs'
                                            offstyle="outline-secondary"
                                            onChange={() => props.onSwitchContractByIndex(index)} />
                                    </td>
                                    {/* <td style={{ paddingTop: '0.63rem' }}>
                                        <a onClick={() => props.onDeleteContractByIndex(index)}>
                                            <div style={{ cursor: 'pointer', width: '30px', paddingBottom: '4px' }}>
                                                <img
                                                    src={require('../../assets/images/delete.png')}
                                                    width="100%"
                                                    alt="Delete logo"
                                                />
                                            </div>
                                        </a>
                                    </td> */}
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
                                    <td className="pl-3"><Form.Check aria-label="option 1" name={contract.db.file} onChange={e => onCheckedHandler(e)} /></td>
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