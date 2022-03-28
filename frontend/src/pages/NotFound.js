import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotFound extends Component {

    render() {
        return (
            <div className='full-screen content centering'>
                <div>
                    <div className='title centering margin-bottom-20'>Oops! It looks like you went to the wrong page</div>
                    <Link className='button button-base centering' to='/main'>Return to main page</Link>
                </div>
            </div>
        )
    }
}

export default NotFound;