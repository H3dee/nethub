import React, { Component } from 'react';
import { api } from '../services/API';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { List, AutoSizer } from 'react-virtualized';
import NotFound from './NotFound';

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      module: '',
      page: 'Stands',
      active: [],
      stands: {},
      topologys: [],
      modules: ['A', 'B', 'C'],
      Champ: 'wsr_express',
      Module: 'A',
      seq: [],
      search: {},
      searchField: '',
      champs: {},
      addUser: {
        status: false,
        username: '',
        password: '',
        name: '',
      },
      addToChamp: {
        status: false,
        Email: '',
        Champ: '',
        Module: '',
      },
      switchChamp: false,
      userCSV: {
        status: false,
        data: '',
      },
      standCSV: {
        status: false,
        data: '',
      },
      tryState: {
        status: false,
        ID: '',
      },
      passwordReset: {
        status: false,
        Email: '',
        Password: '',
      },
      removeStands: {
        status: false,
        ID: '',
      },
      setTime: {
        status: false,
        TimeEnd: '',
      },
    };
    this.SaveStands = this.SaveStands.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.getStands = this.getStands.bind(this);
  }

  getStands(Champ, Module) {
    let ChampKey = '';
    api
      .champGet()
      .then((res) => {
        ChampKey = Object.keys(res.data.Champs).find((key) => res.data.Champs[key].name === Champ);
        this.setState({
          champs: res.data.Champs,
          modules: Object.keys(res.data.Champs[ChampKey].Moduls),
        });
      })
      .catch((err) => console.error(err));
    api
      .StandGet(Champ, Module)
      .then((data) => {
        let a = {};
        let b = ['0'];
        let d = [
          'id',
          'Email',
          'vCenter',
          'Digipass',
          'Datacenter',
          'Digi',
          'Esxipass',
          'Esxiuser',
          'Digi',
        ];
        this.setState({ active: d });
        this.setState({ Module: Module });
        Object.entries(data.data).map(([key, value]) => {
          data.data[key].Module = this.state.Module;
          data.data[key].Champ = this.state.Champ;
          a[key] = false;
          b.push(key);
          this.setState({
            stands: {
              ...this.state.stands,
              [key]: {
                ...data.data[key],
              },
            },
          });
        });
        this.setState({
          search: a,
          seq: b,
        });
        this.listRef.forceUpdateGrid();
      })
      .catch((res) => {
        if (res.data) console.log(res);
      });
  }

  componentDidMount() {
    this.getStands(this.state.Champ, this.state.Module);
  }

  rowRenderer({ key, index, style }) {
    let i = this.state.seq[index + 1];
    let cs = 'input-field input-field-table centering';
    if (!this.state.search[i]) {
      cs = 'input-field input-field-table centering input-field-table-false';
    }
    if (this.state.stands !== {} && i !== undefined)
      return (
        <tr key={index} style={style}>
          <td width="50px">
            <div className={cs} style={{ width: '50px' }}>
              {this.state.stands[i].id}
            </div>
          </td>
          {this.state.stands !== {} &&
            Object.entries(this.state.stands[i]).map(([k, v]) => {
              if (
                k === 'id' ||
                k === 'PortT' ||
                k === 'Port' ||
                k === 'search' ||
                k === 'Champ' ||
                k === 'Module'
              ) {
                return;
              } else {
                return (
                  <td className="td-max-size">
                    <input
                      className="input-field input-field-table"
                      value={v}
                      onChange={(event) => {
                        this.setState({
                          stands: {
                            ...this.state.stands,
                            [i]: {
                              ...this.state.stands[i],
                              [k]: event.target.value,
                            },
                          },
                        });
                        this.listRef.forceUpdateGrid();
                      }}
                    />
                  </td>
                );
              }
            })}
        </tr>
      );
  }

  handleChange(event) {
    this.getStands(this.state.Champ, event.target.getAttribute('value'));
    this.setState({ Module: event.target.getAttribute('value'), searchField: '' });
  }

  GetUsers(event) {
    this.setState({ page: event.target.getAttribute('value'), Module: '', searchField: '' });
    api
      .GetUsers()
      .then((data) => {
        let a = {};
        let b = [];
        let d = ['id', 'Email', 'Name', 'Role', 'Group', 'TryState'];
        this.setState({ active: d });
        this.setState({ stands: data.data });
        Object.entries(data.data).map(([key, value]) => {
          a[key] = false;
          b.push(key);
        });
        this.setState({
          search: a,
          seq: b,
        });
        this.listRef.forceUpdateGrid();
      })
      .catch((res) => {
        if (res.data) console.log(res);
      });
  }

  SaveStands(event) {
    let a = api.StandUpdate(this.state.stands);
    a.then((res) => {
      console.log(res);
      if (res) {
        alert('All saved successfully!');
      }
    }).catch((err) => {
      alert(err);
    });
  }

  Search(event) {
    this.setState({ searchField: event.target.value });
    let a = {};
    let b = this.state.seq;
    let temp = 0;
    let index = 1;
    let ok = false;
    Object.entries(this.state.stands).map(([key, value]) => {
      b[parseInt(key)] = key;
    });
    if (event.target.value === '') {
      Object.entries(this.state.stands).map(([key, value]) => {
        a[key] = false;
      });
    } else {
      Object.entries(this.state.stands).map(([key, value]) => {
        ok = false;
        Object.entries(this.state.stands[key]).map(([k, v]) => {
          if (typeof v === 'string') {
            if (v.toLowerCase().includes(event.target.value.toLowerCase())) {
              ok = true;
            }
          }
        });
        if (!ok) {
          a[key] = true;
        } else {
          temp = b[index];
          a[key] = false;
          b[index] = key;
          b[parseInt(key)] = temp;
          index++;
        }
      });
    }
    this.setState({ search: a, seq: b });
    this.listRef.forceUpdateGrid();
  }

  render() {
    if (Cookies.get('tokenAccess') === undefined) return <NotFound />;
    return (
      <div className="dev">
        <div className="left-panel-admin">
          <ul>
            <div className="admin-title centering">Админ панель</div>
            <li>
              <Link to="/topology">Вернуться на /topology</Link>
            </li>
            <li
              onClick={this.GetUsers}
              className={this.state.page === 'Users' ? 'active' : ''}
              value="Users"
            >
              Пользователи
            </li>
            <li
              onClick={() => {
                this.setState({ addUser: { ...this.state.addUser, status: true } });
              }}
            >
              Создать пользователя
            </li>
            <li
              onClick={() => {
                this.setState({ addToChamp: { ...this.state.addToChamp, status: true } });
              }}
            >
              Добавить пользователя в чемпионат
            </li>
            <li
              onClick={() => {
                this.setState({ switchChamp: { ...this.state.switchChamp, status: true } });
              }}
            >
              Переключить чемпионаты
            </li>
            <li
              onClick={() => {
                this.setState({ userCSV: { ...this.state.userCSV, status: true } });
              }}
            >
              Загрузить пользователей из CSV
            </li>
            <li
              onClick={() => {
                this.setState({ standCSV: { ...this.state.standCSV, status: true } });
              }}
            >
              Загрузить стенды из CSV
            </li>
            <li
              onClick={() => {
                this.setState({ tryState: { ...this.state.tryState, status: true } });
              }}
            >
              Изменить trystate
            </li>
            <li
              onClick={() => {
                this.setState({ removeStands: { ...this.state.removeStands, status: true } });
              }}
            >
              Удалить стенд
            </li>
            <li
              onClick={() => {
                api
                  .GetTopologys()
                  .then((res) => {
                    if (res) this.setState({ topologys: res.data.module.split(',') });
                  })
                  .catch((err) => {
                    if (err) console.error(err);
                  });
                this.setState({ setTime: { ...this.state.setTime, status: true } });
              }}
            >
              Задать таймер
            </li>
            <li>
              <Link to="/CSV_templates.zip" target="_blank" download>
                Скачать шаблоны CSV
              </Link>
            </li>
          </ul>
        </div>

        <div className="up-panel-admin">
          <ul>
            <li
              onClick={() => {
                this.setState({ passwordReset: { ...this.state.passwordReset, status: true } });
              }}
            >
              Сбросить пароль
            </li>
            <li>Добавить в группу</li>
            {Object.entries(this.state.modules).map(([k, v]) => {
              if (v === this.state.Module) {
                return <li className="input-field-table-module-active">{v}</li>;
              } else {
                return (
                  <li
                    value={v}
                    className="input-field-table-module centering"
                    onClick={this.handleChange}
                  >
                    {v}
                  </li>
                );
              }
            })}
            <li className="search-field">
              <input
                className="input-field input-field-table centering"
                value={this.state.searchField}
                onChange={(e) => this.Search(e)}
              />
            </li>
            <li onClick={this.SaveStands} className="float-right active">
              Сохранить
            </li>
          </ul>
        </div>
        {this.state.addUser.status && ( // Модальное окно добавления пользователя
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Добавить пользователя</div>
                <div className="input">
                  <div className="input-header margin-bottom-8">Имя</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) => {
                      this.setState({
                        addUser: {
                          ...this.state.addUser,
                          name: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addUser.name}
                  />
                  <div className="input-header margin-bottom-8">Почта</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) => {
                      this.setState({
                        addUser: {
                          ...this.state.addUser,
                          username: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addUser.username}
                  />
                  <div className="input-header margin-bottom-8">Пароль</div>
                  <input
                    type="text"
                    className="input-field"
                    onChange={(event) => {
                      this.setState({
                        addUser: {
                          ...this.state.addUser,
                          password: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addUser.password}
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      addUser: {
                        status: false,
                        username: '',
                        password: '',
                        name: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    this.setState({
                      addUser: {
                        ...this.state.addUser,
                        status: false,
                      },
                    });
                    let a = api.MakeRegRequest(
                      this.state.addUser.username,
                      this.state.addUser.password,
                      this.state.addUser.name,
                    );
                    this.setState({
                      addUser: {
                        status: false,
                        username: '',
                        password: '',
                        name: '',
                      },
                    });
                    a.then((res) => {
                      if (res.data.status === 'OK') alert('Юху! Пользователь добавлен');
                      else alert('Что-то пошло не так');
                    }).catch((err) => {
                      if (err.data) alert(err.data);
                      else alert(err);
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.addToChamp.status && ( // Модальное окно добавления пользователя в чамп
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Добавить в чемпионат</div>
                <div className="input">
                  <div className="input-header margin-bottom-8">Email</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) => {
                      this.setState({
                        addToChamp: {
                          ...this.state.addToChamp,
                          Email: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addToChamp.Email}
                  />
                  <div className="input-header margin-bottom-8">champ</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) => {
                      this.setState({
                        addToChamp: {
                          ...this.state.addToChamp,
                          Champ: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addToChamp.Champ}
                  />
                  <div className="input-header margin-bottom-8">module</div>
                  <input
                    type="text"
                    className="input-field"
                    onChange={(event) => {
                      this.setState({
                        addToChamp: {
                          ...this.state.addToChamp,
                          Module: event.target.value,
                        },
                      });
                    }}
                    value={this.state.addToChamp.Module}
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      addToChamp: {
                        status: false,
                        Email: '',
                        Champ: '',
                        Module: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    this.setState({
                      addToChamp: {
                        ...this.state.addToChamp,
                        status: false,
                      },
                    });
                    let a = api.addToChamp(
                      this.state.addToChamp.Email,
                      this.state.addToChamp.Champ,
                      this.state.addToChamp.Module,
                    );
                    this.setState({
                      addToChamp: {
                        status: false,
                        Email: '',
                        Champ: '',
                        Module: '',
                      },
                    });
                    a.then((res) => {
                      if (res.data.status === 'OK') alert('Юху! Пользователь добавлен в чемпионат');
                      else alert('Что-то пошло не так');
                    }).catch((err) => {
                      if (err.data) alert(err.data);
                      else alert(err);
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.userCSV.status && ( // Модальное окно загрузки фур пользаков
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title margin-bottom-20">Загрузить пользователей</div>
                <div className="input">
                  <input
                    className="input-field"
                    type="file"
                    onChange={(event) => {
                      this.setState({
                        userCSV: { ...this.state.userCSV, data: event.target.files[0] },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      userCSV: {
                        status: false,
                        data: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    api.userCSV(this.state.userCSV.data);
                    this.setState({
                      userCSV: {
                        status: false,
                        data: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.standCSV.status && ( // Модальное окно загрузки фур стендов
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title margin-bottom-20">Загрузить стенды</div>
                <div className="input">
                  <select className="input-field margin-bottom-8" id="standCSV">
                    {Object.entries(this.state.champs).map(([key, value]) => {
                      return <option>{value.name}</option>;
                    })}
                  </select>
                  <input
                    type="file"
                    className="input-field centering"
                    onChange={(event) => {
                      this.setState({
                        standCSV: { ...this.state.standCSV, data: event.target.files[0] },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      standCSV: {
                        status: false,
                        data: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    api.standCSV(
                      this.state.standCSV.data,
                      document.getElementById('standCSV').options[
                        document.getElementById('standCSV').selectedIndex
                      ].value,
                    );
                    this.setState({
                      standCSV: {
                        status: false,
                        data: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.switchChamp && ( // Модальное окно переключения чемпионата
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Переключить чемпионат</div>
                <div className="input">
                  <select id="champSwitch">
                    {Object.entries(this.state.champs).map(([key, value]) => {
                      return <option>{value.name}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({ switchChamp: false });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    let Champ =
                      document.getElementById('champSwitch').options[
                        document.getElementById('champSwitch').selectedIndex
                      ].value;
                    let ChampKey = Object.keys(this.state.champs).find(
                      (key) => this.state.champs[key].name === Champ,
                    );
                    this.getStands(Champ, Object.keys(this.state.champs[ChampKey].Moduls)[0]);
                    this.setState({ switchChamp: false, Champ: Champ });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.setTime.status && ( // Модальное окно изменения таймера
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Задать/Изменить таймер</div>
                <div className="input">
                  <select id="timeSwitch">
                    {this.state.topologys.map((value) => {
                      return <option>{value}</option>;
                    })}
                  </select>
                  <div className="input-header">время окончания</div>
                  <input
                    type="datetime-local"
                    className="input-field"
                    onChange={(event) => {
                      this.setState({
                        setTime: { ...this.state.setTime, TimeEnd: event.target.value },
                      });
                      console.log(event.target.value, typeof event.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      setTime: {
                        status: false,
                        TimeEnd: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    let Name =
                      document.getElementById('timeSwitch').options[
                        document.getElementById('timeSwitch').selectedIndex
                      ].value;
                    let offset = -(new Date().getTimezoneOffset() / 60);
                    api.setTime(Name, this.state.setTime.TimeEnd, offset.toString());
                    this.setState({
                      setTime: {
                        status: false,
                        TimeEnd: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.passwordReset.status && ( // Модальное окно сброса пароля
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Сбросить пароль</div>
                <div className="input">
                  <div className="input-header margin-bottom-8">email</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) =>
                      this.setState({
                        passwordReset: { ...this.state.passwordReset, Email: event.target.value },
                      })
                    }
                  />
                  <div className="input-header margin-bottom-8">new password</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) =>
                      this.setState({
                        passwordReset: {
                          ...this.state.passwordReset,
                          Password: event.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      passwordReset: {
                        status: false,
                        Email: '',
                        Password: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    api.passwordReset(
                      this.state.passwordReset.Email,
                      this.state.passwordReset.Password,
                    );
                    this.setState({
                      passwordReset: {
                        status: false,
                        Email: '',
                        Password: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.removeStands.status && ( // Модальное окно удаления стенда
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Удалить стенд</div>
                <div className="input">
                  <div className="input-header margin-bottom-8">ID стенда</div>
                  <input
                    type="text"
                    className="input-field margin-bottom-8"
                    onChange={(event) =>
                      this.setState({
                        removeStands: { ...this.state.removeStands, ID: event.target.value },
                      })
                    }
                  />
                  <div className="input-header margin-bottom-8">Current module</div>
                  <div className="input-field margin-bottom-8">{this.state.Module}</div>
                  <div className="input-header margin-bottom-8">Current champ</div>
                  <div className="input-field margin-bottom-8">{this.state.Champ}</div>
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      removeStands: {
                        status: false,
                        ID: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    api
                      .removeStands(this.state.Champ, this.state.Module, this.state.removeStands.ID)
                      .then((res) => {
                        if (res) alert('Юху! Стенд удален!');
                      })
                      .catch((err) => {
                        if (err) console.error(err);
                      });
                    this.setState({
                      removeStands: {
                        status: false,
                        ID: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.tryState.status && ( // Модальное окно изменения trystate
          <div className="block-content">
            <div className="modal-window">
              <div className="modal-window-content">
                <div className="title">Изменить TryState</div>
                <div className="input">
                  <div className="input-header margin-bottom-8">
                    ID или почта пользователя (один пользователь admin@dev.com, диапазон
                    пользователей 6-10, пользователи через запятую 6,76,12)
                  </div>
                  <input
                    onChange={(event) =>
                      this.setState({
                        tryState: { ...this.state.tryState, ID: event.target.value },
                      })
                    }
                    className="input-field"
                  />
                  <select className="width-100" id="tryStateSelector">
                    <option>true</option>
                    <option>false</option>
                    <option>disabled</option>
                  </select>
                </div>
              </div>
              <div className="modal-window-bottom">
                <button
                  className="button button-error"
                  functional="cancel"
                  onClick={() => {
                    this.setState({
                      tryState: {
                        status: false,
                        state: '',
                        ID: '',
                      },
                    });
                  }}
                >
                  Отменить
                </button>
                <button
                  className="button button-base margin-left-10"
                  functional="save"
                  onClick={() => {
                    switch (
                      document.getElementById('tryStateSelector').options[
                        document.getElementById('tryStateSelector').selectedIndex
                      ].text
                    ) {
                      case 'true': {
                        let a = {
                          state: true,
                          ID: this.state.tryState.ID,
                        };
                        api
                          .setTryState(a)
                          .then((res) => {
                            if (res) alert('Юху! Трайстеты применены');
                          })
                          .catch((err) => {
                            if (err) console.error(err);
                          });
                        break;
                      }
                      case 'false': {
                        let a = {
                          state: false,
                          ID: this.state.tryState.ID,
                        };
                        api
                          .setTryState(a)
                          .then((res) => {
                            if (res) alert('Юху! Трайстеты применены');
                          })
                          .catch((err) => {
                            if (err) console.error(err);
                          });
                        break;
                      }
                      case 'disabled': {
                        let a = {
                          state: null,
                          ID: this.state.tryState.ID,
                        };
                        api
                          .setTryState(a)
                          .then((res) => {
                            if (res) alert('Юху! Трайстеты применены');
                          })
                          .catch((err) => {
                            if (err) console.error(err);
                          });
                        break;
                      }
                    }
                    this.setState({
                      tryState: {
                        status: false,
                        ID: '',
                        state: '',
                      },
                    });
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="table-wrapper">
          <tr className="width-100">
            {Object.entries(this.state.active).map(([k, v]) => {
              if (k === 0) {
                return (
                  <td width="50px">
                    <div
                      style={{ width: '50px' }}
                      className="input-field input-field-table-head centering"
                    >
                      {v}
                    </div>
                  </td>
                );
              }
              return (
                <td className="td-max-size">
                  <div className="input-field input-field-table-head centering">{v}</div>
                </td>
              );
            })}
            <td className="color-scroll" width="10px">
              <div className="size-10"></div>
            </td>
          </tr>
          <div className="table">
            {this.state.stands !== {} && this.state.seq !== [] && (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    ref={(ref) => (this.listRef = ref)}
                    width={width} //1500
                    height={height} //770
                    rowHeight={40}
                    rowRenderer={this.rowRenderer}
                    rowCount={Object.keys(this.state.stands).length}
                    overscanRowCount={20}
                    className="width-height-100"
                  />
                )}
              </AutoSizer>
            )}
          </div>
        </div>
      </div>
    );
  }
}
