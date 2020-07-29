import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import { Form, Table, Spinner, OverlayTrigger, Popover, Button } from 'react-bootstrap';

import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import './UserProfile.css';
import {loadContractsUri} from '../../constants/api';
import * as actions from '../../store/actions/index';

const UserProfile = props => {
    const { userContracts } = useSelector(state => state.zenroom);
    const [tableEmpty, setTableEmpty] = useState(true);

    useEffect(() => {

        if (!props.contracts) {
            props.onLoadContracts();
        } else {
            setTableEmpty();
        }
    }, []);

    useEffect(() => {

        if (!props.contracts) {
            setTableEmpty(true);
        } else {
            setTableEmpty(false);
        }
    }, [props.contracts]);

    return (
        <div className={'pb-5 user-contracts'}>
            <h4 className={'mt-5'}>Saved Contracts</h4>

            {tableEmpty
                ? (<div>
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                </div>)
                : (<Table responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Smart contract</th>
                            {/* <th>Zencode (-z)</th> */}
                            <th>Parameter (-a)</th>
                            <th>Parameter (-k)</th>
                            <th>Config (-c)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.contracts && props.contracts.map((contract, index) => {
                            return (<tr key={index}>
                                <td><Form.Check aria-label="option 1" /></td>
                                <td>
                                    <OverlayTrigger
                                        trigger="click"
                                        key={'bottom'}
                                        placement={'bottom'}
                                        overlay={
                                            <Popover id={`popover-positioned-bottom`}>
                                                <Popover.Title as="h3">{`Zencode`}</Popover.Title>
                                                <Popover.Content>
                                                   {contract.zencode}
                                                </Popover.Content>
                                            </Popover>
                                        }
                                    >
                                        <Button variant="secondary">{contract.name}</Button>
                                    </OverlayTrigger>
                                </td>
                                {/* <td>
                                    <a className={'link-text'} href="#" style={{ color: 'red', marginRight: '6px' }}>{contract.zencode ? 'show' : 'empty'}</a>
                                    <BootstrapSwitchButton
                                        onlabel='api'
                                        offlabel='manual'
                                        checked={true}
                                        onstyle="outline-warning"
                                        height='3'
                                        size='xs'
                                        offstyle="outline-info" />
                                </td> */}
                                <td>
                                    <a className={'link-text'} href="#" style={{ color: 'red', marginRight: '6px' }}>empty</a>
                                    <BootstrapSwitchButton
                                        onlabel='api'
                                        offlabel='manual'
                                        checked={true}
                                        onstyle="outline-warning"
                                        height='3'
                                        size='xs'
                                        offstyle="outline-info" />
                                </td>
                                <td>
                                    <a href="#">show</a>
                                </td>
                                <td>
                                    <a href="#">show</a>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-outline-dark" style={{ height: '1.375rem', lineHeight: '0.5', padding: '.375rem .55rem', marginRight: '2px' }}>Edit</button>
                                    <button type="button" className="btn btn-outline-dark" style={{ height: '1.375rem', lineHeight: '0.5', padding: '.375rem .55rem' }}>Swagger</button>
                                    <BootstrapSwitchButton
                                        onlabel='ON'
                                        offlabel='OFF'
                                        checked={true}
                                        onstyle="outline-success"
                                        offstyle="outline-danger"
                                        height='3'
                                        size='xs'
                                        offstyle="outline-info" /></td>
                            </tr>)
                        })
                        }
                    </tbody>
                </Table>)
            }

        </div>
    );

}

const mapStateToProps = state => {
    return {
        contracts: state.zenroom.userContracts,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // onLoadContracts: () => dispatch(actions.loadContracts())
        onLoadContracts: () => dispatch(actions.loadContracts())
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));