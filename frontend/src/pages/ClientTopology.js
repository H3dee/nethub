import React, {Component} from 'react';
import {api} from '../services/API';
import {Redirect, Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import NotFound from './NotFound';

class ClientTopology extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [0, 0, 1],
            devices: {},
            lines: {},
            time: '',
            minutes: 0,
            hours: 0,
            secounds: 0,
            contextmenu: {}
        };

        this.gridClick = this.gridClick.bind(this);
        this.gridMove = this.gridMove.bind(this);
        this.panelClick = this.panelClick.bind(this);
        this.clickDevice = this.clickDevice.bind(this);
        this.Exit = this.Exit.bind(this);
        this.count = this.count.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.pageUp = this.pageUp.bind(this);
        this.pageDown = this.pageDown.bind(this);
        this.clickContextMenu = this.clickContextMenu.bind(this);
        this.deadline = null;
        this.x = null;
    }

    count() {
        var now = new Date().getTime();
        var t = this.deadline - now;
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        this.setState({minutes, hours, seconds})
        if (t < 0) {
            clearInterval(this.x);
            this.setState({minutes: 0, hours: 0, seconds: 0});
            this.Exit()
        }
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll);
        window.addEventListener('mouseup', this.pageUp);
        window.addEventListener('mousedown', this.pageDown);
        document.addEventListener('contextmenu', event => event.preventDefault());
        this.setState({grid: [window.innerWidth / 2, window.innerHeight / 2, this.state.grid[2]]});
        if (this.props.location.state !== undefined) {
            let data = api.TopologyGet(this.props.location.state.request[0], this.props.location.state.request[1]);
            data
                .then((data) => {
                    console.log(data.data);
                    this.setState({devices: data.data.Devices, lines: data.data.Lines, time: data.data.Time});
                    this.deadline = new Date(this.state.time).getTime();
                    this.x = setInterval(this.count, 1000);
                })
                .catch((data) => {
                    console.log(data.data);
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll);
        window.removeEventListener('mouseup', this.pageUp);
        window.removeEventListener('mousedown', this.pageDown);
    }

    handleScroll(event) {
        console.log(event.deltaY);
        if (event.deltaY < 0) {
            if (this.state.grid[2] < 2) {
                this.setState({grid: [this.state.grid[0], this.state.grid[1], this.state.grid[2] + 0.1]});
            }
        } else {
            if (this.state.grid[2] > 0.5) {
                this.setState({grid: [this.state.grid[0], this.state.grid[1], this.state.grid[2] - 0.1]});
            }
        }
    }

    gridMove(event) {
        this.setState({grid: [this.state.grid[0] + event.movementX, this.state.grid[1] + event.movementY, this.state.grid[2]]});
    }

    gridClick(event) {
        if (event.type === 'mousedown') {
            if (event.nativeEvent.which === 1) {
                document.addEventListener('mousemove', this.gridMove);
            }
        }
    }

    pageUp(event) {
        if (event.which === 1) {
            document.removeEventListener('mousemove', this.gridMove);
        }
    }

    pageDown(event) {
        this.setState({contextmenu: {1: undefined}});
    }

    panelClick(event) {
        if (event.nativeEvent.which === 1) {
            if (event.target.getAttribute('functional') === 'centering') {
                this.setState({grid: [window.innerWidth / 2, window.innerHeight / 2, this.state.grid[2]]});
            } else if (event.target.getAttribute('functional') === 'zoom') {
                if (this.state.grid[2] < 2) {
                    this.setState({grid: [this.state.grid[0], this.state.grid[1], this.state.grid[2] + 0.1]});
                }
            } else if (event.target.getAttribute('functional') === 'reduce') {
                if (this.state.grid[2] > 0.5) {
                    this.setState({grid: [this.state.grid[0], this.state.grid[1], this.state.grid[2] - 0.1]});
                }
            }
        }
    }

    clickDevice(event) {
        if (event.nativeEvent.which === 1) {
            let data = api.UpdateTicket(event.target.getAttribute('device').split(', ')[1], this.props.location.state.request[0], this.props.location.state.request[1]);
            let key = event.target.getAttribute('device').split(', ')[0]
            data
                .then(res => {
                    console.log(res.data.link);
                    this.setState({devices: {...this.state.devices, [key]: {...this.state.devices[key], link: res.data.link}}});
                })
                .catch(res => {
                    if (res.data) {
                        console.log(res);
                    }
                });
            console.log(this.state.devices);
        } else if (event.nativeEvent.which === 3) {
            this.setState({contextmenu: {1: {name: event.target.getAttribute('device').split(', ')[1], x: event.pageX, y: event.pageY}}});
        }
    }

    Exit() {
        Cookies.remove('tokenAccess');
        Cookies.remove('tokenRefresh');
        window.location.reload(true);
    }

    clickContextMenu(event) {
        api.ClearDevice(event.target.getAttribute('functional'), this.props.location.state.request[0], this.props.location.state.request[1]);
    }

    render() {
        if (this.props.location.state === undefined) {
            return (
                <NotFound/>
            )
        } else if (!Cookies.get('tokenAccess')) return (<Redirect to='/authorization'/>);
        else {
            return (
                <div className='full-screen'>
                    <div className='grid-client grab' onMouseDown={this.gridClick} onMouseUp={this.gridClick}
                         style={{
                             backgroundSize: 144 * this.state.grid[2],
                             backgroundPositionX: this.state.grid[0],
                             backgroundPositionY: this.state.grid[1]
                         }}>
                        <div className='topology grab' style={{
                            left: this.state.grid[0],
                            top: this.state.grid[1],
                            transform: `scale(${this.state.grid[2]})`
                        }}>
                            {Object.entries(this.state.devices).map(([key, value]) => {
                                if (value.name === 'input') {
                                    return <input className='input-grid grab' value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}} disabled/>
                                } else if (value.name === 'input-red') {
                                    return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                                  className='input-grid-red' onChange={this.changeText}
                                                  value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}}/>
                                } else if (value.name === 'input-mini') {
                                    return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                                  className='input-grid-mini' placeholder='TEXT' onChange={this.changeText}
                                                  value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}}/>
                                }  else if (value.name === 'input-mini-rotate') {
                                    return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                                  className='input-grid-mini-rotate' placeholder='TEXT' onChange={this.changeText}
                                                  value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}}/>
                                } else if (value.name === 'input-mini-rotate-30') {
                                    return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                                  className='input-grid-mini-rotate-30' placeholder='TEXT' onChange={this.changeText}
                                                  value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}}/>
                                } else if (value.name === 'input-mini-rotate-330') {
                                    return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                                  className='input-grid-mini-rotate-330' placeholder='TEXT' onChange={this.changeText}
                                                  value={this.state.devices[key].text}
                                                  style={{left: value.x, top: value.y}}/>
                                } else if (value.name === 'cloud') {
                                    return <div
                                        className={`device device-${value.name} grab`}
                                        style={{left: value.x, top: value.y}}/>
                                } else if (value.name === 'dot') {
                                    return <div
                                        className={`device grab`}
                                        style={{left: value.x, top: value.y}}/>
                                } else {
                                    return <a onClick={this.clickDevice} onContextMenu={this.clickDevice} device={`${key}, ${value.vm}`} target='_blank'
                                              href={value.link} rel='noopener noreferrer'
                                              className={`device device-${value.name} grab z-index`}
                                              style={{left: value.x, top: value.y}}/>
                                }
                            })}
                            <svg style={{overflow: 'visible'}}>
                                {Object.entries(this.state.lines).map(([key, value]) => {
                                    if (value[1] && this.state.devices[value[0]].name === 'input') {
                                        return <line
                                            key={key} x1={this.state.devices[value[0]].x}
                                            y1={this.state.devices[value[0]].y + 30}
                                            x2={this.state.devices[value[1]].x + 35}
                                            y2={this.state.devices[value[1]].y + 35} className='line'/>
                                    } else if (value[1] && this.state.devices[value[0]].name !== 'cloud' && this.state.devices[value[1]].name !== 'cloud') {
                                        return <line
                                            key={key} x1={this.state.devices[value[0]].x + 35}
                                            y1={this.state.devices[value[0]].y + 35}
                                            x2={this.state.devices[value[1]].x + 35}
                                            y2={this.state.devices[value[1]].y + 35} className='line'/>
                                    } else if (value[1] && this.state.devices[value[0]].name === 'cloud' && this.state.devices[value[1]].name !== 'cloud') {
                                        return <line
                                            key={key} x1={this.state.devices[value[0]].x + 100}
                                            y1={this.state.devices[value[0]].y + 50}
                                            x2={this.state.devices[value[1]].x + 35}
                                            y2={this.state.devices[value[1]].y + 35} className='line'/>
                                    } else if (value[1] && this.state.devices[value[1]].name === 'cloud' && this.state.devices[value[0]].name !== 'cloud') {
                                        return <line
                                            key={key} x1={this.state.devices[value[0]].x + 35}
                                            y1={this.state.devices[value[0]].y + 35}
                                            x2={this.state.devices[value[1]].x + 100}
                                            y2={this.state.devices[value[1]].y + 50} className='line'/>
                                    } else if (value[1] && this.state.devices[value[1]].name === 'cloud' && this.state.devices[value[0]].name === 'cloud') {
                                        return <line
                                            key={key} x1={this.state.devices[value[0]].x + 100}
                                            y1={this.state.devices[value[0]].y + 50}
                                            x2={this.state.devices[value[1]].x + 100}
                                            y2={this.state.devices[value[1]].y + 50} className='line'/>
                                    }
                                })}
                            </svg>
                        </div>
                    </div>
                    <div className='header border-bottom centering-vertically'>
                        <div className='title margin-left-10'>Remote Topology</div>
                        <div
                            className="title right">{this.state.seconds || this.state.minutes || this.state.hours ? `${('0' + String(this.state.hours)).slice(-2)}:${('0' + String(this.state.minutes)).slice(-2)}:${('0' + String(this.state.seconds)).slice(-2)}` : ''} {this.props.location.state.request[2]}
                            <Link to='/main' className='button button-base centering margin-left-10'>Back to main</Link>
                            <div onClick={this.Exit} className='button button-error centering margin-left-10'>Quit</div>
                        </div>
                    </div>
                    <div className='left-panel' onClick={this.panelClick}>
                        <div functional='centering'
                             className='left-panel_button left-panel_button_centering margin-bottom-8'/>
                        <div functional='zoom' className='left-panel_button left-panel_button_zoom margin-bottom-8'/>
                        <div functional='reduce' className='left-panel_button left-panel_button_reduce margin-bottom-8'/>
                    </div>
                    {Object.entries(this.state.contextmenu).map(([key, value]) => {
                        if (value !== undefined) {
                            return <div className='contextmenu' style={{left: value.x, top: value.y}}>
                                <div className='contextmenu-stage centering-vertically' functional={value.name} onMouseDown={this.clickContextMenu}><div className='contextmenu-stage-reload' functional={value.name}></div>сброс вм</div>
                            </div>
                        }
                    })}
                </div>
            )
        }
    }
}

export default ClientTopology;
