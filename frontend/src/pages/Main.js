import React, {Component} from 'react';
import {api} from '../services/API';
import {Redirect, Link} from 'react-router-dom';
import Cookies from 'js-cookie';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            champs: {},
            name: '',
            nochamps: false
        };
        this.arrowClick = this.arrowClick.bind(this);
        this.moduleClick = this.moduleClick.bind(this);
        this.Exit = this.Exit.bind(this);
    }

    componentDidMount() {
        let data = api.GetMain();
        data
            .then(res => {
                this.setState({name: res.data['FIO']});
                if (res.data['Champs'] === undefined) return this.setState({nochamps: true});
                this.setState({champs: res.data['Champs'], name: res.data['FIO']});
                Object.entries(this.state.champs).map(([key]) => {
                    this.setState({champs: {...this.state.champs, [key]: {...this.state.champs[key], hide: 50}}})
                });
            })
            .catch(res => {
                if (res.data) console.log(res);
            });
    }

    arrowClick(event) {
        if (this.state.champs[event.target.getAttribute('functional')].hide === 50) {
            event.target.style = 'transform: rotate(90deg);';
            this.setState({
                champs: {
                    ...this.state.champs,
                    [event.target.getAttribute('functional')]: {
                        ...this.state.champs[event.target.getAttribute('functional')],
                        hide: 250
                    }
                }
            });
        } else {
            event.target.style = 'transform: rotate(0deg);';
            this.setState({
                champs: {
                    ...this.state.champs,
                    [event.target.getAttribute('functional')]: {
                        ...this.state.champs[event.target.getAttribute('functional')],
                        hide: 50
                    }
                }
            });
        }
    }

    moduleClick(event) {
        console.log('test');
    }

    Exit() {
        Cookies.remove('tokenAccess');
        Cookies.remove('tokenRefresh');
        window.location.reload(true);
    }

    render() {
        if (!Cookies.get('tokenAccess')) return (<Redirect to='/authorization'/>);
        return (
            <div className='full-screen'>
                <div className='header flex centering-vertically'>
                    <div className='title margin-left-10'>Remote Topology</div>
                    <div className="title right">{this.state.name}
                        <div onClick={this.Exit} className='button button-error centering margin-left-10'>Quit</div>
                    </div>
                </div>
                <div className='content content_48px top-48'>
                    {this.state.nochamps? <div className='title margin-left-20'>You don't have championships assigned</div> :Object.entries(this.state.champs).map(([key, value]) => {
                        return <div key={key} className='champ margin-bottom-20' style={{maxHeight: value.hide}}>
                            <div className='champ-up centering-vertically'>
                                <div className='title margin-left-10'>{value.name}</div>
                                <div functional={key} className='icon icon-arrow' onClick={this.arrowClick}></div>
                            </div>
                            {value.Moduls === undefined ? <div className='champ-down centering-vertically'>
                                <div className='title-small margin-left-20'>You don't have modules assigned</div>
                            </div> : Object.entries(value.Moduls).map(([keym, valuem]) => {
                                return <Link to={{
                                    pathname: '/client_topology',
                                    state: {request: [value.name, keym, this.state.name]}
                                }} key={keym} className='champ-down centering-vertically' onClick={this.moduleClick}>
                                    <div className='title-small margin-left-20'>Module {keym}</div>
                                </Link>
                            })}
                        </div>
                    })}
                </div>
            </div>
        )
    }
}

export default Main;
