import React, { useEffect, useState, useRef } from 'react';
import AceDropDown from '../dropdown/AceDropDown';
import { hasJsonStructure } from '../../../helpers/jsonHelper';

import './ResizeableInputAceContainers.css';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-ambiance.js";
import "ace-builds/src-noconflict/mode-zencode";
import "ace-builds/src-noconflict/mode-json5";

let isResizing = null;
let lastDownY = 0;
let resizingBox;

const ResizeableContainer = props => {
    const parent = useRef(null);
    const firstBox = useRef(null);
    const secondBox = useRef(null);

    const [boxesHeight, setBoxesHeight] = useState({
        first: '80%',
        second: 100,
        third: 100,
        fourth: 100
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
        const newContractHeight = parent.current.clientHeight - 311;
        setBoxesHeight(state => {
            return {
                ...state,
                first: newContractHeight
            };
        });
    }, []);


    return (
        <div ref={parent} style={{ width: '100%', height: '100%' }}>
            <div ref={firstBox} style={{ height: boxesHeight.first, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>

                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Contract</h6>
                    <AceDropDown collectionType={'zencodes'}/>
                </div>
                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'first');
                    }}
                />
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
                />
            </div>
            <div ref={secondBox} style={{ height: boxesHeight.second, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>
                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Keys</h6>
                    <AceDropDown collectionType={'keys'}/>
                </div>

                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'second');
                    }}
                />
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
                />
            </div>
            <div style={{ height: boxesHeight.third, width: '100%', position: 'relative', backgroundColor: '#e8e8e8' }}>
                <div className="header-container">
                    <h6 style={{ margin: 0 }}>Data</h6>
                    <AceDropDown collectionType={'datas'}/>
                </div>
                <div
                    className="dragger"
                    onMouseDown={event => {
                        handleMousedown(event, 'third');
                    }}
                />
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
                    <AceDropDown collectionType={'configs'}/>
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