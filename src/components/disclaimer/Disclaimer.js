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
                This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
                </div>
                <div className='pb-3 text-justify px-2'></div>
                <div className='pb-3 text-justify px-2'>
                All the Zencode scripts stored in this service are do belong to the respetive authors and all released under Apache2 license. Find a list of  GNU Affero General Public License at: https://www.gnu.org/licenses/
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
