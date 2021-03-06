/** @namespace nw */

var fs = require('fs');
var path = require('path');
try {
  var configFile = fs.readFileSync(path.join(nw.App.dataPath, '/PH Configuration'), 'utf-8');
  var config = JSON.parse(configFile);
  nw.Window.open('modules/login/index.html', { 'show': false });
} catch (e) {
  alert('Ошибка: не найден файл конфигурации');
  nw.Window.open('', { show: false });
  nw.App.quit();
}

function loadApp(usertype) {
  nw.Window.open('index.html', {'show': false}, function(win) {
    win.maximize();
    var main_menu = new nw.Menu({ type: 'menubar' });

    var windowMenu = new nw.Menu();
    windowMenu.append(new nw.MenuItem({
      label: 'Новое окно',
      click: function() {
        if (usertype === 'admin') {
          loadApp('admin');
        } else {
          loadApp('user');
        }
      }
    }));

    var functionsMenu = new nw.Menu();
    var additionalFunctionsMenu = new nw.Menu();
    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Возвраты',
      click: function() {
        win.window.location.href = './modules/returns/index.html';
      }
    }));
    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Вторичные извещения',
      click: function() {
        win.window.location.href = './modules/secondaries/index.html';
      }
    }));
    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Телефонные коды',
      click: function() {
        win.window.location.href = './modules/phonecodes/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Мелкие пакеты',
      click: function() {
        win.window.location.href = './modules/packet_print/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Ярлыки на возврат',
      click: function () {
        // TODO: implement f20 print
        win.window.location.href = './modules/f20_print/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Дополнительные',
      submenu: additionalFunctionsMenu
    }));

    if (usertype === 'admin') {
      var developmentMenu = new nw.Menu();
      developmentMenu.append(new nw.MenuItem({
        label: 'Database Control',
        click: function () {
          win.window.location.href = 'tests/database/index.html';
        }
      }));
      developmentMenu.append(new nw.MenuItem({
        label: 'colresizable',
        click: function () {
          win.window.location.href = 'tests/colresizable/link.html';
        }
      }));
      developmentMenu.append(new nw.MenuItem({
        label: 'encryption test',
        click: function () {
          win.window.location.href = 'tests/encrypting/index.html';
        }
      }));
      developmentMenu.append(new nw.MenuItem({
        label: 'mstk test',
        click: function () {
          win.window.location.href = 'tests/area_check/index.html';
        }
      }));
      developmentMenu.append(new nw.MenuItem({
        label: 'stats test',
        click: function () {
          win.window.location.href = 'tests/statistics/index.html';
        }
      }));
    }

    var resourcesMenu = new nw.Menu();
    resourcesMenu.append(new nw.MenuItem({
      label: 'Pochta.RU',
      click: function() {
        nw.Window.open('http://pochta.ru', {}, function(win) {
          win.maximize();
        });
      }
    }));

    var propertiesMenu = new nw.Menu();
    propertiesMenu.append(new nw.MenuItem({
      label: 'Руководство пользователя',
      click: function() {
        nw.Window.open('res/manual.html', {}, function(win){
          win.maximize();
        });
      }
    }));
    propertiesMenu.append(new nw.MenuItem({
      label: 'О программе',
      click: function() {
        nw.Window.open('modules/about/index.html', { 'show': false });
      }
    }));

    main_menu.append(new nw.MenuItem({
      label: 'Окно',
      submenu: windowMenu
    }));
    main_menu.append(new nw.MenuItem({
      label: 'Функции',
      submenu: functionsMenu
    }));
    main_menu.append(new nw.MenuItem({
      label: 'Ресурсы',
      submenu: resourcesMenu
    }));
    if (usertype === 'admin') {
      main_menu.append(new nw.MenuItem({
        label: 'Разработка',
        submenu: developmentMenu
      }));
    }
    main_menu.append(new nw.MenuItem({
      label: 'Свойства',
      submenu: propertiesMenu
    }));

    win.menu = main_menu;
  });
}
