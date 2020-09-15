import React from 'react';

const Footer = props => {

    return (
        <div style={{ marginLeft: '15px', marginRight: '15px', marginBottom: '30px' }}>
            {/* <div className='m-0 p-0 justify-content-center mt-5'> */}
            <div className=' row justify-content-center mt-3'>
                <h3>Proudly crafted in the EU</h3>
            </div>
            <div className='row justify-content-center mt-5'>
                <div className='col'>
                    <div className='d-flex justify-content-sm-center justify-content-md-end align-items-center h-100'>
                        <a onClick={() => window.open('https://zenroom.org', "_blank")} style={{ cursor: 'pointer' }} className='mr-sm-0 mr-md-4'>
                            <img
                                src={require('../../assets/images/zlogo.png')}
                                // width="150"
                                height="55"
                                className="d-inline-block"
                                alt="Zenroom logo"
                            />
                        </a>
                    </div>
                </div>
                <div className='col'>
                    <div className='d-flex justify-content-sm-center justify-content-md-start align-items-center h-100'>
                        <a onClick={() => window.open('https://decodeproject.eu/', "_blank")} style={{ cursor: 'pointer', }} className='ml-sm-0 ml-md-4'>
                            <img
                                src={require('../../assets/images/dlogo.png')}
                                // width="150"
                                height="100"
                                className="d-inline-block"
                                alt="decode logo"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className='row justify-content-center mt-5'>
                <h6 style={{ maxWidth: '50%', textAlign: 'center' }}>
                    This project received funding from the European Union’s Horizon 2020 research and innovation programme <b>DECODE</b>, under grant agreement nr. 732546.
                </h6>
            </div>
            <div className='row justify-content-center mt-5'>
                <a onClick={() => window.open('https://dyne.org', "_blank")} style={{ cursor: 'pointer', }}>
                <p>
                    Copyright 2019-{new Date().getFullYear()} Dyne.org
                </p>
                </a>
            </div>

            {/* </div> */}

        </div>
    );
}

export default Footer;