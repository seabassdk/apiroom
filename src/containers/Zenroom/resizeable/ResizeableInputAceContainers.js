import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, DropdownButton} from 'react-bootstrap'
import AceDropDown from '../dropdown/AceDropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import { hasJsonStructure } from '../../../helpers/jsonHelper';

import './ResizeableInputAceContainers.css';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-ambiance.js";
import "ace-builds/src-noconflict/mode-zencode";
import "ace-builds/src-noconflict/mode-json5";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";
import { Json5HighlightRules } from 'ace-builds/src-noconflict/mode-json5';

import introSpection from '../../../constants/introspection.json';

let isResizing = null;
let lastDownY = 0;
let resizingBox;

const ResizeableContainer = props => {
    const parent = useRef(null);
    const firstBox = useRef(null);
    const secondBox = useRef(null);

    const [boxesHeight, setBoxesHeight] = useState({
        first: '65%',
        second: 185,
        third: 185,
        fourth: 155
    });

    const zencodeChangeHandler = (newValue) => {
        props.zencodeChanged(newValue);
    }

    const keysChangeHandler = (newValue) => {
        props.keysChanged(newValue);
    }

    const dataChangeHandler = (newValue) => {
        props.dataChanged(newValue);
    }
    const configChangeHandler = (newValue) => {
        props.configChanged(newValue);
    }


    const handleMousedown = (e, box) => {
        e.stopPropagation();
        e.preventDefault();
        lastDownY = e.clientY;
        // we will only add listeners when needed, and remove them afterward
        document.addEventListener('mousemove', cbHandleMouseMove);
        document.addEventListener('mouseup', cbHandleMouseUp);
        isResizing = true;
        resizingBox = box;
    };

    const handleMousemove = (e) => {

        let diff = e.clientY - lastDownY;
        lastDownY = lastDownY + diff


        switch (resizingBox) {
            case 'second':
                setBoxesHeight(state => {
                    const firstHeight = state.first + diff;
                    const secondHeight = state.second - diff;
                    return {
                        ...state,
                        first: firstHeight,
                        second: secondHeight
                    };

                });
                break;
            case 'third':
                setBoxesHeight(state => {
                    const secondHeight = state.second + diff;
                    const thirdHeight = state.third - diff;
                    return {
                        ...state,
                        second: secondHeight,
                        third: thirdHeight
                    };
                });
                break;
            case 'fourth':
                setBoxesHeight(state => {
                    const thirdHeight = state.third + diff;
                    const fourthHeight = state.fourth - diff;
                    return {
                        ...state,
                        third: thirdHeight,
                        fourth: fourthHeight
                    };
                });
                break;
        }
    };

    const handleMouseup = e => {
        if (!isResizing) {
            return;
        }
        isResizing = false;
        lastDownY = 0;
        document.removeEventListener('mousemove', cbHandleMouseMove);
        document.removeEventListener('mouseup', cbHandleMouseUp);
    };

    const cbHandleMouseMove = React.useCallback(handleMousemove, []);
    const cbHandleMouseUp = React.useCallback(handleMouseup, []);

    useEffect(() => {
        addCompleter({
            getCompletions: function (editor, session, pos, prefix, callback) {

                if ( editor.env.document.$mode.$id.includes('zencode')){
                    callback(null, introSpection);
                }

            },
        });

        let newContractHeight = parent.current.clientHeight - 250;

        if (newContractHeight < 60)
            newContractHeight = 60;

        setBoxesHeight(state => {
            return {
                ...state,
                first: newContractHeight
            };
        });
    }, []);



    const load = (index) => {
        props.loadContract(index);
    }

    return (
        <div ref={parent} style={{ width: '100%', height: '100%' }}>
            <div ref={firstBox} style={{ height: boxesHeight.first, width: '100%', position: 'relative', backgroundColor: '#e8e8e8', overflow: 'hidden' }}>

                <div className="header-container-zencode" style={{ height: '27px' }}>
                    <div className={'h-100 d-flex align-items-center zencode-controls'}>
                        <h6 style={{ margin: 0, display: "inline-block", lineHeight: '1.2rem' }}>Zencode smart contract</h6>
                        <a onClick={(e) => window.open('https://dev.zenroom.org/#/pages/zencode-cookbook-intro ', "_blank")} style={{fontSize: '1.1rem'}}>
                            <FontAwesomeIcon
                                icon={faQuestionCircle} size='1x'
                                color='#6c757d'
                                style={{ fontSize: '1.1rem', marginLeft: '10px', cursor: 'pointer' }}
                            />
                        </a>

                        {/* <DropdownButton className={'d-flex align-items-center h-100'} id="dropdown-variants-Secondary" title="Examples" variant='info' size='sm' style={{marginLeft: '15px', height: '100%'}}>
                            {props.contracts.map((contract, index) => {
                                return (
                                    <Dropdown.Item key={index} onClick={() => { load(index) }}> {contract.name}</Dropdown.Item>
                                );
                            })
                            }

                        </DropdownButton> */}

                    </div>
                    <AceDropDown collectionType={'zencodes'} />
                </div>
                <div style={{
                    position: 'absolute',
                    height: '19px',
                    width: '100%',
                    backgroundColor: 'white',
                    bottom: 0,
                    zIndex: 10,
                    borderTop: '4px solid #ddd'
                }}>

                </div>
                <AceEditor
                    mode="zencode"
                    theme="ambiance"
                    onChange={zencodeChangeHandler}
                    name="UNIQUE_ID_OF_DIV"
                    // editorProps={{ $blockScrolling: true }}
                    showPrintMargin={false}
                    width='100%'
                    height={(boxesHeight.first - 39).toString() + 'px'}
                    value={props.zencode}
                    setOptions={{
                        enableLiveAutocompletion: true,
                        // enableBasicAutocompletion: true,
                        enableSnippets: true
                    }}
                />
            </div>
            <div ref={secondBox} style={{ height: boxesHeight.second, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>
                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Keys</h6>
                    <AceDropDown collectionType={'keys'} />
                </div>

                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'second');
                    }}
                />
                <div style={{
                    position: 'absolute',
                    height: '19px',
                    width: '100%',
                    backgroundColor: 'white',
                    bottom: 0,
                    zIndex: 10,
                    borderTop: '4px solid #ddd'
                }}>
                </div>

                <AceEditor
                    mode="json5"
                    theme="ambiance"
                    onChange={keysChangeHandler}
                    name="UNIQUE_ID_OF_DIV"
                    // editorProps={{ $blockScrolling: true }}
                    showPrintMargin={false}
                    width='100%'
                    height={(boxesHeight.second - 39).toString() + 'px'}
                    value={props.keys && hasJsonStructure(props.keys) ? JSON.stringify(JSON.parse(props.keys), null, '\t') : props.keys}
                    setOptions={{
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                    }}
                />
            </div>
            <div style={{ height: boxesHeight.third, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>
                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Data</h6>
                    <AceDropDown collectionType={'datas'} />
                </div>
                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'third');
                    }}
                />

                <div style={{
                    position: 'absolute',
                    height: '19px',
                    width: '100%',
                    backgroundColor: 'white',
                    bottom: 0,
                    zIndex: 10,
                    borderTop: '4px solid #ddd'
                }}>

                </div>

                <AceEditor
                    mode="json5"
                    theme="ambiance"
                    onChange={dataChangeHandler}
                    name="UNIQUE_ID_OF_DIV"
                    // editorProps={{ $blockScrolling: true }}
                    showPrintMargin={false}
                    width='100%'
                    height={(boxesHeight.third - 39).toString() + 'px'}
                    value={props.data && hasJsonStructure(props.data) ? JSON.stringify(JSON.parse(props.data), null, '\t') : props.data}
                />
            </div>
            <div style={{ height: boxesHeight.fourth, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>
                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Config</h6>
                    <AceDropDown collectionType={'configs'} />
                </div>
                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'fourth');
                    }}
                />
                <AceEditor
                    mode="json5"
                    theme="ambiance"
                    onChange={configChangeHandler}
                    name="UNIQUE_ID_OF_DIV"
                    // editorProps={{ $blockScrolling: true }}
                    showPrintMargin={false}
                    width='100%'
                    height={(boxesHeight.fourth - 39).toString() + 'px'}
                    value={props.config && hasJsonStructure(props.config) ? JSON.stringify(JSON.parse(props.config), null, '\t') : props.config}
                />
            </div>
        </div>
    );
}

export default ResizeableContainer;