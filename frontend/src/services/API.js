import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: 'http://rt.wsr39.online/api',
});

export const api = {
  MakeAuthRequest(email, password) {
    // Авторизация пользователей
    let data = {
      email,
      password,
    };
    return instance.post('/authorization', data);
  },

  MakeRegRequest(Email, Password, Name) {
    // Регистрация пользователей
    let data = {
      Email,
      Password,
      Name,
    };
    return instance.post('/registration', data);
  },

  MakeSaveRequest(Name, Devices, Lines, Keys, Time) {
    // Создание топологии пользователей, а.к.а действие при нажатии кнопки сохранить в редакторе топологий
    let data = {
      Name,
      Devices,
      Lines,
      Keys,
      Time,
    };
    return instance.post('/topology/save', data);
  },

  GetMain() {
    // получение чемпионатов на главной странице и (возможно) на админке
    return instance.post('/main');
  },

  GetModule(Name) {
    let data = {
      Name,
    };
    // return console.log(data);
    return instance.post('/topology/get', data);
  },

  GetTopologys() {
    // Получение списка топологий при создании модуля
    return instance.get('/module/get');
  },

  TopologyCreate(Name) {
    // создание пустой топологии
    let data = {
      Name,
    };
    // return console.log(data);
    return instance.post('/topology/create', data);
  },

  ModuleCreate(Champ, Module) {
    // создание пустого модуля
    let data = {
      Champ,
      Module,
    };
    // return console.log(data);
    return instance.post('/module/create', data);
  },

  TopologyClone(Champ_Module, ChampTo, ModuleTo) {
    // Копирование топологии, если она была выбрана из списка уже существующих
    let ChampFrom = Champ_Module.split('_')[0];
    let ModuleFrom = Champ_Module.split('_')[1];
    let data = {
      ChampFrom,
      ModuleFrom,
      ChampTo,
      ModuleTo,
    };
    return console.log(data);
    // return instance.post('/topology/clone', data);
  },

  ChampCreate(Champ) {
    // Создание пустого чемпионата
    let data = {
      Champ,
    };
    // return console.log(data);
    return instance.post('/champ/create', data);
  },

  ChampRemove(Champ) {
    // Удаление чемпионата
    let data = {
      Champ,
    };
    // return console.log(data);
    return instance.post('/champ/remove', data);
  },

  ModuleRemove(Champ, Module) {
    // Удаление модуля
    let data = {
      Champ,
      Module,
    };
    // return console.log(data);
    return instance.post('/module/remove', data);
  },

  TopologyRemove(Name) {
    // Удаление топологии
    let data = {
      Name,
    };
    // return console.log(data);
    return instance.post('/topology/remove', data);
  },

  TopologyLink(Champ, Module, Name) {
    // Привязывание топологии
    let data = {
      Champ,
      Module,
      Name,
    };
    // return console.log(data);
    return instance.post('/topology/link', data);
  },

  StandGet(Champ, Module) {
    // Получение списка стендов
    let data = {
      Champ,
      Module,
    };
    // return console.log(data);
    return instance.post('/stand/get', data);
  },

  StandAdd(Champ, Module) {
    // Добавление стенда
    let data = {
      Champ,
      Module,
    };
    // return console.log(data);
    return instance.post('/stand/create', data);
  },

  StandRemove(Champ, Module, ID) {
    // Удаление стенда
    let data = {
      Champ,
      Module,
      ID,
    };
    // return console.log(data);
    return instance.post('/stand/remove', data);
  },

  StandUpdate(data) {
    // Обновление всех стендов
    // return console.log(data);
    return instance.post('/stand/allupdate', data);
  },

  TopologyGet(Champ, Module) {
    // Получение стенда со стороны клиента
    let data = {
      Champ,
      Module,
    };
    return instance.post('/topology', data);
  },

  UpdateTicket(Device, Champ, Module) {
    // Обновление тикета
    let data = {
      Device,
      Champ,
      Module,
    };
    return instance.post('/device/ticket', data);
  },

  ClearDevice(Device, Champ, Module) {
    // Сбрасывание устройства
    let data = {
      Device,
      Champ,
      Module,
    };
    return instance.post('/device/clear', data);
  },

  GetUsers() {
    // Получение списка пользователей
    return instance.get('/admin/alluser');
  },

  addToChamp(Email, Champ, Module) {
    // Добавление пользователя в чемпионат
    let data = {
      Email,
      Champ,
      Module,
    };
    return instance.post('/admin/addtochamp', data);
  },

  removeStands(Champ, Module, ID) {
    // Удаление стенда
    let data = {
      Champ,
      Module,
      ID: parseInt(ID),
    };
    return instance.post('/stand/remove', data);
  },

  champGet() {
    // Получение всех чемпионатов
    return instance.get('/champ/get');
  },

  standCSV(file, Champ) {
    // грузчик для фур со стендами
    let data = new FormData();
    data.set('file', file);
    instance
      .post('/admin/standfromcsv', data)
      .then((res) => {
        res.data.champ = Champ;
        instance
          .post('/admin/standfromcsv/create', res.data)
          .then((res) =>
            res.data
              ? alert(`Accepted: ${res.data.accept}, Denied: ${res.data.discard}`)
              : alert('something is wrong'),
          )
          .catch((err) => {
            alert('Ошибочка. Посмотрите консоль');
            console.log(err);
          });
      })
      .catch((err) => {
        alert('Ошибочка. Посмотрите консоль');
        console.log(err);
      });
  },

  userCSV(file) {
    // грузчик для фур с пользаками
    const data = new FormData();
    data.append('file', file);
    instance.post('/admin/userfromcsv', data).then((res) => {
      res.data.champ = 'wsr_express';
      instance
        .post('/admin/userfromcsv/create', res.data)
        .then((res) =>
          res.data
            ? alert(`Accepted: ${res.data.accept}, Denied: ${res.data.discard}`)
            : alert('something is wrong'),
        );
    });
  },

  setTryState(data) {
    let payload = {
      ID: data.ID,
      Status: data.state,
    };
    return instance.post('/admin/trystate', payload);
  },

  passwordReset(Email, Password) {
    // сброс пароля пользователя
    let data = {
      Email,
      Password,
    };
    instance
      .post('/admin/resetpass', data)
      .then((res) => {
        if (res.data.status === 'OK') alert('Юху! Пароль сброшен');
      })
      .catch((err) => {
        if (err) console.error(err);
      });
  },

  setTime(Name, TimeEnd, TimeZone) {
    TimeEnd = TimeEnd + ':00.00Z';
    let data = {
      Name,
      TimeEnd,
      TimeZone,
    };
    // console.log(data);
    instance.post('/admin/settime', data).then((res) => {
      if (res) alert('Юху! Таймер установлен');
    });
  },
};
