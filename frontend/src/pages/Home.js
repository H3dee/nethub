import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Home extends Component {

    render() {
        return (
            <div className='full-screen background centering'>
                <div>
                    <div className='title margin-bottom-40'>Welcome to Remote Topology!</div>
                    <div className='logo margin-bottom-40'/>
                    <div className='flex'>
                        <Link to='/registration' className='button button-base centering margin-right-10'>Sign up</Link>
                        <Link to='/authorization' className='button button-base centering'>Sign in</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
