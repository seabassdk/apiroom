import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Button, DropdownButton, ButtonGroup, Spinner } from 'react-bootstrap';
import * as actions from '../../../store/actions/index';

import './AceDropDown.css';



const AceDropDown = props => {
    const [open, setOpen] = useState(false);
    const [collection, setCollection] = useState([]);

    const onLoadType = () => {
        props.onLoadCollection(props.collectionType);
    }

    const itemClickHandler = (index) => {
        switch (props.collectionType) {
            case 'zencodes':
                props.onZencodeChanged(collection[index].content);
                break;
            case 'keys':
                props.onKeysChanged(collection[index].content);
                break;
            case 'datas':
                props.onDataChanged(collection[index].content);
                break;
            case 'configs':
                props.onConfigChanged(collection[index].content);
                break;
            default:
                setCollection([]);

        }
    }


    useEffect(() => {
        if (!props.isLoading && props.token) {
            switch (props.collectionType) {
                case 'zencodes':
                    setCollection(props.zencodeCollection);
                    break;
                case 'keys':
                    setCollection(props.keysCollection);
                    break;
                case 'datas':
                    setCollection(props.dataCollection);
                    break;
                case 'configs':
                    setCollection(props.configCollection);
                    break;
                default:
                    setCollection([]);

            }
        }
    }, [props.isLoading]);

    if (!props.token)
        return (
            <DropdownButton
                className={'custom-button'}
                as={ButtonGroup}
                key={'secondary'}
                id={'dropdown-variants-secondary'}
                variant={'secondary'}
                title={''}
                renderMenuOnMount={false}
            >
                {props.collectionType === 'zencodes' &&
                    <Dropdown.Header>Your stored Zencode scripts</Dropdown.Header>
                }
                {props.collectionType === 'keys' &&
                    <Dropdown.Header>Your stored keys</Dropdown.Header>
                }
                {props.collectionType === 'datas' &&
                    <Dropdown.Header>Your stored data</Dropdown.Header>
                }
                {props.collectionType === 'configs' &&
                    <Dropdown.Header>Your stored config files</Dropdown.Header>
                }

                <Dropdown.Item eventKey="1">You must be logged in to use this feature</Dropdown.Item>

            </DropdownButton>

        );

    return (
        <DropdownButton
            className={'custom-button'}
            as={ButtonGroup}
            key={'secondary'}
            id={'dropdown-variants-secondary'}
            variant={'secondary'}
            onClick={() => onLoadType()}
            title={''}
            renderMenuOnMount={false}
        >
            {props.collectionType === 'zencodes' &&
                <Dropdown.Header>Your stored Zencode scripts</Dropdown.Header>
            }
            {props.collectionType === 'keys' &&
                <Dropdown.Header>Your stored keys</Dropdown.Header>
            }
            {props.collectionType === 'datas' &&
                <Dropdown.Header>Your stored data</Dropdown.Header>
            }
            {props.collectionType === 'configs' &&
                <Dropdown.Header>Your stored config files</Dropdown.Header>
            }
            {!props.isLoading

                ? props.loadingError
                    ? <Dropdown.Item eventKey="4">{props.loadingError}</Dropdown.Item>
                    : (collection.length > 0)
                        ? (<div>
                            {
                                collection.map((item, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        eventKey={index}
                                        onClick={() => itemClickHandler(index)}>
                                        {item.name}
                                    </Dropdown.Item>)
                                )
                            }
                        </div>)
                        : <Dropdown.Item eventKey="4">No {props.collectionType}</Dropdown.Item>


                : <Dropdown.Item eventKey="5">
                    Loading...
                <Spinner
                        className={'ml-2'}
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                </Dropdown.Item>
            }
        </DropdownButton>

    );
}

const mapStateToProps = state => {
    return {
        isLoading: state.collections.isLoading,
        zencodeCollection: state.collections.zencodeCollection,
        keysCollection: state.collections.keysCollection,
        dataCollection: state.collections.dataCollection,
        configCollection: state.collections.configCollection,
        loadingError: state.collections.loadingError,
        token: state.auth.token
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadCollection: type => dispatch(actions.loadCollection(type)),
        onZencodeChanged: (zencode) => dispatch(actions.changeZencode(zencode)),
        onKeysChanged: (keys) => dispatch(actions.changeKeys(keys)),
        onDataChanged: (data) => dispatch(actions.changeData(data)),
        onConfigChanged: (config) => dispatch(actions.changeConfig(config)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AceDropDown);