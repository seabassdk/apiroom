import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

import './Disclaimer.css';
const Disclaimer = props => {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const handleAccept = () => {
        localStorage.setItem('disclaimer', 'accepted');
        setShowDisclaimer(false);
    }

    const handleClose = () => {
        setShowDisclaimer(false);
    };

    return (
        <Modal className="d-flex justify-content-start p-5" show={showDisclaimer} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <h3 className='my-3' style={{ textAlign: 'center' }}>Disclaimer</h3>
                <div className='pb-3 text-justify px-2'>
                    Det er en kendsgerning, at man bliver distraheret af læsbart indhold på en side, når man betragter dens layout. Meningen med at bruge Lorem Ipsum er, at teksten indeholder mere eller mindre almindelig tekstopbygning i modsætning til "Tekst her - og mere tekst her", mens det samtidigt ligner almindelig tekst. Mange layoutprogrammer og webdesignere bruger Lorem Ipsum som fyldtekst. En søgning på Lorem Ipsum afslører mange websider, som stadig er på udviklingsstadiet. Der har været et utal af variationer, som er opstået enten på grund af fejl og andre gange med vilje (som blandt andet et resultat af humor).
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-start p-5">
                <Button className='w-100' size="lg" onClick={handleAccept}>
                    Accept
                </Button>
            </Modal.Footer>
        </Modal>


    )
}

export default Disclaimer
