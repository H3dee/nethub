import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {api} from '../services/API';
import Cookies from 'js-cookie';
import NotFound from './NotFound';
import {List, AutoSizer} from 'react-virtualized';

class Topology extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [0, 0, 1],
      devices: {},
      lines: {},
      draggable: null,
      settings: {},
      ruzilDevices: [],
      champs: {},
      moduleCreate: false,
      topologys: [],
      topologysValue: '',
      selectModule: [],
      addModule: null,
      moduleValue: '',
      champCreate: false,
      champValue: '',
      editTopology: '',
      stands: {},
      redirect: '',
      checkbox: {},
      error_counter: 0
    };

    this.network_devices = 1;
    this.error_counter = 0;
    this.redirect = '';
    this.allClick = this.allClick.bind(this);
    this.gridMove = this.gridMove.bind(this);
    this.gridClick = this.gridClick.bind(this);
    this.panelClick = this.panelClick.bind(this);
    this.draggableDevice = this.draggableDevice.bind(this);
    this.deviceMove = this.deviceMove.bind(this);
    this.changeText = this.changeText.bind(this);
    this.createLine = this.createLine.bind(this);
    this.deviceClick = this.deviceClick.bind(this);
    this.window = this.window.bind(this);
    this.changeName = this.changeName.bind(this);
    this.arrowClick = this.arrowClick.bind(this);
    this.moduleClick = this.moduleClick.bind(this);
    this.moduleCreate = this.moduleCreate.bind(this);
    this.changeTopology = this.changeTopology.bind(this);
    this.topologyClick = this.topologyClick.bind(this);
    this.backgroundClick = this.backgroundClick.bind(this);
    this.select = this.select.bind(this);
    this.addModule = this.addModule.bind(this);
    this.champCreate = this.champCreate.bind(this);
    this.champAdd = this.champAdd.bind(this);
    this.moduleAdd = this.moduleAdd.bind(this);
    this.removeChamp = this.removeChamp.bind(this);
    this.removeModule = this.removeModule.bind(this);
    this.removeTopology = this.removeTopology.bind(this);
    this.topologySelect = this.topologySelect.bind(this);
    this.standAdd = this.standAdd.bind(this);
    this.standRemove = this.standRemove.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.countDevices = this.countDevices.bind(this);
  }

  addModule(event) {
    this.setState({addModule: true});
  }

  rowRenderer({
                key,
                index,
                style
              }) {
    if (this.state.stands !== {}) {
      return (
        <div key={key} style={style} className='champ margin-bottom-20'>
          <div className='champ-up centering-vertically'>
            <div className='title margin-left-10'>Stand {this.state.stands[index + 1].id}</div>
            <div className='icon icon-right icon-arrow'></div>
            <div functional={`${index + 1}, ${this.state.stands[index + 1].id}`} className='icon icon-bin'
                 onClick={this.standRemove}></div>
          </div>
          <div className='champ-down centering-vertically'>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>address esxi</div>
              <input className='input-field' value={this.state.stands[index + 1].Address} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Address: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>datacenter</div>
              <input className='input-field' value={this.state.stands[index + 1].Datacenter} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Datacenter: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>esxi user</div>
              <input className='input-field' value={this.state.stands[index + 1].Esxiuser} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Esxiuser: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>esxi password</div>
              <input className='input-field' value={this.state.stands[index + 1].Esxipass} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Esxipass: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>address digi</div>
              <input className='input-field' value={this.state.stands[index + 1].Digi} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Digi: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>email</div>
              <input className='input-field' value={this.state.stands[index + 1].Email} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Email: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>digi user</div>
              <input className='input-field' value={this.state.stands[index + 1].Digiuser} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Digiuser: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            <div className='input margin-bottom-20'>
              <div className='input-header margin-bottom-8'>digi password</div>
              <input className='input-field' value={this.state.stands[index + 1].Digipass} onChange={event => {
                this.setState({
                  stands: {
                    ...this.state.stands,
                    [index + 1]: {...this.state.stands[index + 1], Digipass: event.target.value}
                  }
                });
                this.listRef.forceUpdateGrid();
              }}/>
            </div>
            {Object.entries(this.state.devices).map(([keyd, valued]) => {
              if (valued.vm && (valued.name === 'router' || valued.name === 'asa-5500' || valued.name === 'layer-3-switch' || valued.name === 'workgroup-switch' || valued.name === 'firewall')) {
                return <div key={keyd} className='input margin-bottom-20'>
                  <div className='input-header margin-bottom-8'>{valued.vm} port</div>
                  <input className='input-field' value={this.state.stands[index + 1].Port[valued.vm]}
                         onChange={event => {
                           this.setState({
                             stands: {
                               ...this.state.stands,
                               [index + 1]: {
                                 ...this.state.stands[index + 1],
                                 Port: {...this.state.stands[index + 1].Port, [valued.vm]: event.target.value}
                               }
                             }
                           });
                           this.listRef.forceUpdateGrid();
                         }}/>
                </div>
              }
            })}
          </div>
        </div>
      );
    }
  }

  countDevices(data) {
    if (data !== {}) {
      Object.entries(data).map(([key, value]) => {
        if (value.vm && (value.name === 'router' || value.name === 'asa-5500' || value.name === 'layer-3-switch' || value.name === 'workgroup-switch' || value.name === 'firewall')) {
          this.network_devices++;
        }
      })
    }
  }

  componentDidMount() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    this.setState({grid: [window.innerWidth / 2, window.innerHeight / 2, this.state.grid[2]]});
    let data = api.GetMain();
    data
      .then(res => {
        if (res.data['Champs'] === undefined) return;
        this.setState({champs: res.data['Champs']});
        Object.entries(this.state.champs).map(([key]) => {
          this.setState({champs: {...this.state.champs, [key]: {...this.state.champs[key], hide: 50}}});
        });
      })
      .catch(res => {
          console.error('Error at GetMain:', res);
      });
    data = api.GetTopologys()
    data
      .then(res => {
        let a = res.data['module'];
        a = a.split(',');
        this.setState({topologys: a});
      })
      .catch(res => {
        return this.redirect = 'no_access';
        console.error('Error in GetTopologys (Probably unathorized)', res);
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


  gridMove(event) {
    this.setState({grid: [this.state.grid[0] + event.movementX / this.state.grid[2], this.state.grid[1] + event.movementY / this.state.grid[2], this.state.grid[2]]});
  }

  gridClick(event) {
    if (event.nativeEvent.which === 3) {
      document.addEventListener('mousemove', this.gridMove);
    }
  }

  allClick(event) {
    if (event.nativeEvent.which === 3) {
      document.removeEventListener('mousemove', this.gridMove);
    } else if (event.nativeEvent.which === 1 && event.type === 'mouseup') {
      this.setState({draggable: null});
      document.removeEventListener('mousemove', this.deviceMove);
    }
  }

  createLine(event) {
    if (event.target.getAttribute('device')) {
      if (Object.entries(this.state.lines)[Object.keys(this.state.lines).length - 1] === undefined) {
        this.setState({
          lines: {
            ...this.state.lines,
            [Math.random().toString(36).substring(2, 6)]: [event.target.getAttribute('device')]
          }
        });
      } else if (Object.entries(this.state.lines)[Object.keys(this.state.lines).length - 1][1].length === 1 && Object.entries(this.state.lines)[Object.keys(this.state.lines).length - 1][1][0] !== event.target.getAttribute('device')) {
        this.setState({
          lines: {
            ...this.state.lines,
            [Object.keys(this.state.lines)[Object.keys(this.state.lines).length - 1]]: [...this.state.lines[Object.keys(this.state.lines)[Object.keys(this.state.lines).length - 1]], event.target.getAttribute('device')]
          }
        });
        document.removeEventListener('mousedown', this.createLine);
      } else {
        this.setState({
          lines: {
            ...this.state.lines,
            [Math.random().toString(36).substring(2, 6)]: [event.target.getAttribute('device')]
          }
        });
      }
    }
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
        if (this.state.grid[2] > 1) {
          this.setState({grid: [this.state.grid[0], this.state.grid[1], this.state.grid[2] - 0.1]});
          {/*****************************************************************************************************/
          }
        }
      } else if (event.target.getAttribute('functional') === 'line') {
        document.addEventListener('mousedown', this.createLine);
      } else if (event.target.getAttribute('functional') === 'save') {
        this.error_counter = 0;
        let a = api.MakeSaveRequest(this.state.editTopology, this.state.devices, this.state.lines, this.state.ruzilDevices, '0000-00-00T00:00:00.00Z')
        a
          .then(res => {
          if (res) {
            this.error_counter++;
          }})
          .catch(err => {
            alert(err);
          });
        a = api.StandUpdate(this.state.stands)
        a
          .then(res => {
          if (res) {
            this.error_counter++;
          }
          if (this.error_counter === 2) {
            alert('All saved successfully!');
          }})
          .catch(err => {
            alert(err);
          });
      }
    }
  }

  deviceClick(event) {
    if (event.target.className.split(' ')[1] !== 'device-cloud' || event.target.className.split(' ')[1] !== 'dot') {
      this.setState({settings: {name: event.target.getAttribute('device')}});
    }
  }

  changeText(event) {
    this.setState({
      devices: {
        ...this.state.devices,
        [event.target.getAttribute('device')]: {
          ...this.state.devices[event.target.getAttribute('device')],
          text: event.target.value
        }
      }
    });
  }

  deviceMove(event) {
    this.setState({
      devices: {
        ...this.state.devices,
        [this.state.draggable]: {
          ...this.state.devices[this.state.draggable],
          name: this.state.devices[this.state.draggable].name,
          x: event.pageX / this.state.grid[2] - (this.state.grid[0] - (window.innerWidth - window.innerWidth / this.state.grid[2]) / 2) - 35,
          y: event.pageY / this.state.grid[2] - (this.state.grid[1] - (window.innerHeight - window.innerHeight / this.state.grid[2]) / 2) - 35
        }
      }
    });
  }

  changeName(event) {
    this.setState({topology: [event.target.value, false]})
  }

  window(event) {
    if (event.target.getAttribute('functional') === 'cancel') {
      if (event.target.value !== '') {
        this.network_devices--;
        this.listRef.forceUpdateGrid();
      }
      this.setState({
        devices: {
          ...this.state.devices,
          [this.state.settings.name]: {
            ...this.state.devices[this.state.settings.name],
            vm: ''
          }
        }
      });
      this.listRef.forceUpdateGrid();
      this.setState({settings: {}});
    } else if (event.target.getAttribute('functional') === 'save') {
      this.setState({settings: {}});
    } else {
      if (event.target.value.length === 1) {
        this.network_devices++;
        this.listRef.forceUpdate();
      }
      if (event.target.value.length === 0) {
        this.network_devices--;
        this.listRef.forceUpdate();
      }
      this.setState({
        devices: {
          ...this.state.devices,
          [this.state.settings.name]: {
            ...this.state.devices[this.state.settings.name],
            vm: event.target.value
          }
        }
      });
      this.setState({settings: {...this.state.settings, vm: event.target.value}});
      this.listRef.forceUpdateGrid();
    }
  }

  Exit() {
    Cookies.remove('tokenAccess');
    Cookies.remove('tokenRefresh');
    window.location.reload(true);
  }

  draggableDevice(event) {
    if (event.nativeEvent.which === 1) {
      if (event.target.getAttribute('component')) {
        if (event.type === 'mousedown') {
          const random = Math.random().toString(36).substring(2, 6);
          this.setState({draggable: random});
          this.setState({
            devices: {
              ...this.state.devices,
              [random]: {
                name: event.target.getAttribute('component'),
                x: event.pageX / this.state.grid[2] - (this.state.grid[0] - (window.innerWidth - window.innerWidth / this.state.grid[2]) / 2) - 35,
                y: event.pageY / this.state.grid[2] - (this.state.grid[1] - (window.innerHeight - window.innerHeight / this.state.grid[2]) / 2) - 35
              }
            }
          });
          this.setState({ruzilDevices: [...this.state.ruzilDevices, random]});
          document.addEventListener('mousemove', this.deviceMove);
        }
      }
      if (event.target.getAttribute('device')) {
        if (event.type === 'mousedown') {
          this.setState({draggable: event.target.getAttribute('device')});
          document.addEventListener('mousemove', this.deviceMove);
        }
      }
    }
  }

  moduleClick(event) {
    if (event.target.className.split(' ')[0] === 'champ-down' || event.target.className.split(' ')[0] === 'title-small') {
      this.setState({editTopology: this.state.champs[event.target.getAttribute('functional').split(', ')[0]].Moduls[event.target.getAttribute('functional').split(', ')[1]].Topology});
      let data = api.GetModule(this.state.champs[event.target.getAttribute('functional').split(', ')[0]].Moduls[event.target.getAttribute('functional').split(', ')[1]].Topology);
      data
        .then((data) => {
          this.network_devices = 0;
          this.setState({devices: data.data.Devices, lines: data.data.Lines, ruzilDevices: data.data.Keys});
          this.countDevices(data.data.Devices);
        })
        .catch((data) => {
          console.error(`Error at GetModule with module name being ${this.state.champs[event.target.getAttribute('functional').split(', ')[0]].Moduls[event.target.getAttribute('functional').split(', ')[1]].Topology}`, data.data);
        });
      data = api.StandGet(this.state.selectModule[2], event.target.getAttribute('functional').split(', ')[1]);
      data
        .then((data) => {
          this.setState({stands: data.data});
          Object.entries(this.state.stands).map(([key, value]) => {
            this.setState({
              stands: {
                ...this.state.stands,
                [key]: {
                  ...this.state.stands[key],
                  Module: this.state.selectModule[1],
                  Champ: this.state.selectModule[2]
                }
              }
            });
          });
        })
        .catch((data) => {
          console.error(`Error at StandGet for champ ${this.state.selectModule[2]} `, data)
        });
      this.setState(this.setState({champs: null}));
    }
  }

  moduleCreate(event) {
    this.setState({moduleCreate: event.target.getAttribute('functional')});
  }

  changeTopology(event) {
    this.setState({topologysValue: event.target.value});
  }

  topologyClick(event) {
    this.setState({topologys: [...this.state.topologys, this.state.topologysValue]});
    this.setState({topologysValue: ''});
    api.TopologyCreate(this.state.topologysValue)
      .catch(err => console.error('Error at TopologyCreate', err.data));
  }

  backgroundClick(event) {
    this.setState({
      moduleCreate: '',
      addModule: null,
      champCreate: false,
      champValue: '',
      moduleValue: '',
      topologysValue: ''
    });
  }

  select(event) {
    this.setState({selectModule: event.target.getAttribute('functional').split(', ')});
  }

  addModule(event) {
    this.setState({addModule: true});
  }

  champCreate(event) {
    this.setState({champCreate: true});
  }

  champAdd(event) {
    this.setState({
      champs: {
        ...this.state.champs,
        [Object.keys(this.state.champs).length]: {name: this.state.champValue, Moduls: {}, hide: 50}
      }, champCreate: false
    });
    api.ChampCreate(this.state.champValue)
      .catch(err => console.error('Error at ChampCreate', err.data));
    this.setState({champValue: ''});
  }

  moduleAdd(event) {
    this.setState({
      champs: {
        ...this.state.champs,
        [this.state.selectModule[0]]: {
          ...this.state.champs[this.state.selectModule[0]],
          Moduls: {
            ...this.state.champs[this.state.selectModule[0]].Moduls,
            [this.state.moduleValue]: {Topology: false}
          }
        }
      }, addModule: false
    });
    api.ModuleCreate(this.state.champs[this.state.selectModule[0]].name, this.state.moduleValue)
      .catch(err => console.error('Error at ModuleCreate', err.data));
    this.setState({moduleValue: ''});
  }

  removeChamp(event) {
    api.ChampRemove(event.target.getAttribute('functional').split(', ')[1])
      .catch(err => console.error(`Error at ChampRemove`, err.data));
    const copy = {...this.state.champs};
    delete copy[event.target.getAttribute('functional').split(', ')[0]];
    this.setState({champs: copy});
  }

  removeModule(event) {
    console.log('remove module', event.target.getAttribute('functional'));
    api.ModuleRemove(event.target.getAttribute('functional').split(', ')[1], event.target.getAttribute('functional').split(', ')[2])
      .catch(err => console.error(`Error at ModuleRemove with champname ${event.target.getAttribute('functional').split(', ')[1]} and modulename ${event.target.getAttribute('functional').split(', ')[2]}`, err.data));
    const copy = {...this.state.champs[event.target.getAttribute('functional').split(', ')[0]].Moduls};
    delete copy[event.target.getAttribute('functional').split(', ')[2]];
    this.setState({
      champs: {
        ...this.state.champs,
        [event.target.getAttribute('functional').split(', ')[0]]: {
          ...this.state.champs[event.target.getAttribute('functional').split(', ')[0]],
          Moduls: copy
        }
      }
    });
  }

  removeTopology(event) {
    api.TopologyRemove(event.target.getAttribute('functional'))
      .error(err => console.error(`Error at TopologyRemove with topologyname ${event.target.getAttribute('functional')}`, err.data));
    this.setState({
      champs: {
        ...this.state.champs,
        [this.state.selectModule[0]]: {
          ...this.state.champs[this.state.selectModule[0]],
          Moduls: {
            ...this.state.champs[this.state.selectModule[0]].Moduls,
            [this.state.selectModule[1]]: {Topology: false}
          }
        }
      }
    });
    this.setState({
      topologys: this.state.topologys.filter(function (data) {
        return data !== event.target.getAttribute('functional')
      })
    });
  }

  topologySelect(event) {
    if (event.target.className.split(' ')[0] === 'champ-down' || event.target.className.split(' ')[0] === 'title-small') {
      let data = api.TopologyLink(this.state.selectModule[2], this.state.selectModule[1], event.target.getAttribute('functional'));
      data
        .then((data) => {
          console.log(data.data)
        })
        .catch((data) => {
          console.error(`error at TopologyLink with champname ${this.state.selectModule[2]}, modulename ${this.state.selectModule[1]} and topologyname ${event.target.getAttribute('functional')}`, data.data)
        });
      this.setState({
        moduleCreate: '',
        champs: {
          ...this.state.champs,
          [this.state.selectModule[0]]: {
            ...this.state.champs[this.state.selectModule[0]],
            Moduls: {
              ...this.state.champs[this.state.selectModule[0]].Moduls,
              [this.state.selectModule[1]]: {Topology: event.target.getAttribute('functional')}
            }
          }
        }
      });
    }
  }

  standAdd(event) {
    let data = api.StandAdd(this.state.selectModule[2], this.state.selectModule[1]);
    data
      .then((data) => {
        this.setState({
          stands: {
            ...this.state.stands,
            [Object.keys(this.state.stands).length + 1]: {
              id: parseInt(data.data.id),
              Address: '',
              Digi: '',
              Digipass: '',
              Digiuser: '',
              Esxipass: '',
              Esxiuser: '',
              Email: '',
              Datacenter: '',
              Module: '',
              Port: {}
            }
          }
        });
        this.listRef.forceUpdateGrid();
      })
      .catch((data) => {
        console.error(`Error at StandAdd with champname ${this.state.selectModule[2]} and modulename ${this.state.selectModule[1]}`, data.data);
      });
  }

  standRemove(event) {
    api.StandRemove(this.state.selectModule[2], this.state.selectModule[1], parseInt(event.target.getAttribute('functional').split(', ')[1]))
      .catch(err => console.error(`Error at StandRemove with champname ${this.state.selectModule[2]}, modulename ${this.state.selectModule[1]} and standid ${parseInt(event.target.getAttribute('functional').split(', ')[1])}`, err.data));
    const copy = {...this.state.stands};
    delete copy[event.target.getAttribute('functional').split(', ')[0]];
    this.setState({stands: copy});
  }

  render() {
    if (this.redirect === 'no_access') {
      return (
        <NotFound/>
      )
    } else if (!Cookies.get('tokenAccess')) {
      return (<Redirect to='/authorization'/>);
    }
    else {
      return (
        <div className='full-screen' onMouseUp={this.allClick}>
          {this.state.settings.name &&
          <div className='block-content'>
            <div className='modal-window'>
              <div className='modal-window-content'>
                <div className='input'>
                  <div className='input-header margin-bottom-8'>имя устройства</div>
                  <input type='text' className='input-field' onChange={this.window}
                         value={this.state.devices[this.state.settings.name].vm}/>
                </div>
              </div>
              <div className='modal-window-bottom'>
                <button className='button button-error' functional='cancel' onClick={this.window}>Очистить
                </button>
                <button className='button button-base margin-left-10' functional='save'
                        onClick={this.window}>Сохранить
                </button>
              </div>
            </div>
          </div>
          }
          {this.state.champs &&
          <div className='block-content'>
            <div className='modal-window modal-window-content'>
              <div className='title centering-horizontally margin-bottom-20'>Выбор модуля</div>
              {Object.entries(this.state.champs).map(([key, value]) => {
                return <div key={key} className='champ margin-bottom-20' style={{maxHeight: value.hide}}>
                  <div className='champ-up centering-vertically'>
                    <div functional={key} className='title margin-left-10'>{value.name}</div>
                    <div functional={`${key}, ${value.name}`} className='icon icon-bin'
                         onClick={this.removeChamp}></div>
                    <div functional={key} className='icon icon-right icon-arrow' onClick={this.arrowClick}></div>
                  </div>
                  {Object.entries(value.Moduls).map(([keym, valuem]) => {
                    return <div functional={`${key}, ${keym}, ${value.name}`} key={keym} onClick={valuem.Topology && this.moduleClick}
                                onMouseDown={this.select}
                                className='champ-down centering-vertically'>
                      <div className={`title-small margin-left-20 ${!valuem.Topology && 'title-small-error'}`}
                           functional={`${key}, ${keym}, ${value.name}`}>Module {keym} ({valuem.Topology ? valuem.Topology : 'none'})
                      </div>
                      <div className='icon icon-bin' functional={`${key}, ${value.name}, ${keym}`}
                           onClick={this.removeModule}></div>
                      <div className='icon icon-right icon-pencil' functional={`${key}, ${keym}, ${value.name}`}
                           onClick={this.moduleCreate}></div>
                    </div>
                  })}
                  <div key={key} className='champ-down centering-vertically' functional={`${key}, add, ${value.name}`}
                       onClick={this.addModule} onMouseDown={this.select}>
                    <div className='title-small margin-left-20' functional={`${key}, add`}>Add Module</div>
                    <div className='icon icon-add' functional={`${key}, add`}></div>
                  </div>
                </div>
              })}
              <div className='champ'>
                <div className='champ-up centering-vertically margin-bottom-20' onClick={this.champCreate}>
                  <div className='title margin-left-10'>Add Champ</div>
                  <div className='icon icon-add'></div>
                </div>
              </div>
              <Link to='/main' className='button button-base centering margin-bottom-20'>Перейти к главной
                странице</Link>
              <Link to='/admin' className='button button-base centering margin-bottom-20'>Перейти к админке</Link>
              <button className='button button-error' onClick={this.Exit}>Выйти в окно</button>
            </div>
          </div>
          }
          {this.state.moduleCreate &&
          <div className='full-screen centering'>
            <div className='block-content' onClick={this.backgroundClick}/>
            <div className='modal-window modal-window-content z-index'>
              <div className='title centering-horizontally margin-bottom-20'>Выбор топологии</div>
              <div className='champ margin-bottom-20'>
                {this.state.topologys.map((value) => {
                  return <div functional={value} className='champ-down centering-vertically'
                              onClick={this.topologySelect}>
                    <div functional={value} className='title-small margin-left-20'>{value}</div>
                    <div functional={value} className='icon icon-bin' onClick={this.removeTopology}></div>
                    <div functional={value} className='icon icon-right icon-copy'></div>
                  </div>
                })}
              </div>
              <div className='input margin-bottom-20'>
                <div className='input-header margin-bottom-8'>название топологии</div>
                <input className='input-field' onChange={this.changeTopology} value={this.state.topologysValue}/>
              </div>
              <button className='button button-base margin-bottom-8' onClick={this.topologyClick}>Создать</button>
            </div>
          </div>
          }
          {this.state.addModule &&
          <div className='full-screen centering'>
            <div className='block-content' onClick={this.backgroundClick}></div>
            <div className='modal-window modal-window-content z-index'>
              <div className='title centering-horizontally margin-bottom-20'>Добавить модуль</div>
              <div className='input margin-bottom-20'>
                <div className='input-header margin-bottom-8'>название модуля</div>
                <input className='input-field' onChange={(event) => {
                  this.setState({moduleValue: event.target.value})
                }} value={this.state.moduleValue}/>
              </div>
              <button className='button button-base margin-bottom-8' onClick={this.moduleAdd}>Создать</button>
            </div>
          </div>
          }
          {this.state.champCreate &&
          <div className='full-screen centering'>
            <div className='block-content' onClick={this.backgroundClick}></div>
            <div className='modal-window modal-window-content z-index'>
              <div className='title centering-horizontally margin-bottom-20'>Добавить чемпионат</div>
              <div className='input margin-bottom-20'>
                <div className='input-header margin-bottom-8'>название чемпионата</div>
                <input className='input-field' onChange={(event) => {
                  this.setState({champValue: event.target.value})
                }} value={this.state.champValue}/>
              </div>
              <button className='button button-base margin-bottom-8' onClick={this.champAdd}>Создать</button>
            </div>
          </div>
          }
          <div className='device-header'>
            <div component='router' className='device device-router' onMouseDown={this.draggableDevice}/>
            <div component='asa-5500' className='device device-asa-5500 margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='workgroup-switch' className='device device-workgroup-switch margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='layer-3-switch' className='device device-layer-3-switch margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='pc' className='device device-pc margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='laptop' className='device device-laptop margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='voltage' className='device device-voltage-top margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='fileserver' className='device device-fileserver margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='firewall' className='device device-firewall margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='cloud' className='device device-cloud-top margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input' className='device device-input margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input-red' className='device device-input-red margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input-mini' className='device device-input-mini margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input-mini-rotate' className='device device-input-mini-rotate margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input-mini-rotate-30' className='device device-input-mini-rotate-30 margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='input-mini-rotate-330' className='device device-input-mini-rotate-330 margin-left-10'
                 onMouseDown={this.draggableDevice}/>
            <div component='dot' className='device device-dot margin-left-10'
                 onMouseDown={this.draggableDevice}/>
          </div>
          <div className='left-panel' onClick={this.panelClick}>
            <div functional='centering'
                 className='left-panel_button left-panel_button_centering margin-bottom-8'/>
            <div functional='zoom' className='left-panel_button left-panel_button_zoom margin-bottom-8'/>
            <div functional='reduce'
                 className='left-panel_button left-panel_button_reduce margin-bottom-8'/>
            <div functional='line' className='left-panel_button left-panel_button_line margin-bottom-8'/>
            <div functional='save' className='left-panel_button left-panel_button_save'/>
          </div>
          <div className='right-panel'>
            <div className='content hidden margin-bottom-20'>
              {this.state.stands !== {} &&
              <AutoSizer>
                {({height, width}) => (
                  <List
                  ref={(ref) => this.listRef = ref}
                  width={width}
                  height={height}
                  rowHeight={762 + this.network_devices * 84}
                  rowRenderer={this.rowRenderer}
                  rowCount={Object.keys(this.state.stands).length}
                  overscanRowCount={0}
                  className='width-height-100'
                  />
                )}
              </AutoSizer>}
            </div>
            <button className='button button-base margin-bottom-8' onClick={this.standAdd}>Добавить стенд</button>
          </div>
          <div className='grid' onMouseDown={this.gridClick} style={{
            backgroundPositionX: this.state.grid[0],
            backgroundPositionY: this.state.grid[1],
            transform: `scale(${this.state.grid[2]})`
          }}>
            <div className='topology' style={{left: this.state.grid[0], top: this.state.grid[1]}}>
              {Object.entries(this.state.devices).map(([key, value]) => {
                if (value.name === 'input') {
                  return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                className='input-grid' placeholder='TEXT' onChange={this.changeText}
                                value={this.state.devices[key].text}
                                style={{left: value.x, top: value.y}}/>
                } else if (value.name === 'input-red') {
                  return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                className='input-grid-red' placeholder='TEXT' onChange={this.changeText}
                                value={this.state.devices[key].text}
                                style={{left: value.x, top: value.y}}/>
                } else if (value.name === 'input-mini') {
                  return <input onMouseDown={this.draggableDevice} key={key} device={key}
                                className='input-grid-mini' placeholder='TEXT' onChange={this.changeText}
                                value={this.state.devices[key].text}
                                style={{left: value.x, top: value.y}}/>
                } else if (value.name === 'input-mini-rotate') {
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
                  return <div onMouseDown={this.draggableDevice} key={key} device={key}
                              className={`device device-${value.name}`}
                              onDoubleClick={this.deviceClick}
                              style={{left: value.x, top: value.y}}/>
                } else {
                  return <div onMouseDown={this.draggableDevice} key={key} device={key}
                              className={`device z-index device-${value.name}`}
                              onDoubleClick={this.deviceClick}
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
                  } else if (value[1] && this.state.devices[value[1]].name === 'input') {
                    return <line className='line'/>
                  } else if (value[1] && this.state.devices[value[0]].name === 'input') {
                    return <line className='line'/>
                  }
                })}
              </svg>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Topology;
