/* global nw */
var fs = require('fs');
try {
  var configFile = fs.readFileSync("res/config.json");
  var config = JSON.parse(configFile);
} catch (e) {
  alert("Ошибка: не найден файл конфигурации");
}

nw.Window.open('modules/login/index.html',{"show": false});

function loadApp() {
  nw.Window.open('index.html', {"width": 1366, "height": 768, "show": false}, function(win) {
    win.maximize();
    var main_menu = new nw.Menu({ type: 'menubar' });

    var windowMenu = new nw.Menu();
    windowMenu.append(new nw.MenuItem({
      label: 'Новое окно',
      click: function() {
        loadApp();
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
      label: 'Дополнительные',
      submenu: additionalFunctionsMenu
    }));

    var resourcesMenu = new nw.Menu();
    resourcesMenu.append(new nw.MenuItem({
      label: 'Pochta.RU',
      click: function() {
        nw.Window.open('http://pochta.ru',{"width": 1366, "height": 768}, function(win) {
          win.maximize();
        });
      }
    }));

    var propertiesMenu = new nw.Menu();
    propertiesMenu.append(new nw.MenuItem({
      label: 'Руководство пользователя',
      click: function() {
        nw.Window.open('res/manual.html',{"width": 1366, "height": 768}, function(win){
          win.maximize();
        });
      }
    }));
    propertiesMenu.append(new nw.MenuItem({
      label: 'О программе',
      click: function() {
        nw.Window.open('modules/about/index.html', {"show": false});
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
      label: "Ресурсы",
      submenu: resourcesMenu
    }));
    main_menu.append(new nw.MenuItem({
      label: 'Свойства',
      submenu: propertiesMenu
    }));

    win.menu = main_menu;
  });
}

function loadAdminApp() {
  nw.Window.open('index.html', {"width": 1366, "height": 768}, function(win) {
    win.maximize();
    var main_menu = new nw.Menu({ type: 'menubar' });

    var windowMenu = new nw.Menu();
    windowMenu.append(new nw.MenuItem({
      label: 'Новое окно',
      click: function() {
        loadAdminApp();
      }
    }));

    var functionsMenu = new nw.Menu();
    functionsMenu.append(new nw.MenuItem({
      label: 'Возвраты',
      click: function() {
        win.window.location.href = './modules/returns/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Вторичные извещения',
      click: function() {
        win.window.location.href = './modules/secondaries/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
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

    var resourcesMenu = new nw.Menu();
    resourcesMenu.append(new nw.MenuItem({
      label: 'Pochta.RU',
      click: function() {
        nw.Window.open('http://pochta.ru',{"width": 1366, "height": 768}, function(win) {
          win.maximize();
        });
      }
    }));

    var developmentMenu = new nw.Menu();
    developmentMenu.append(new nw.MenuItem({
      label: 'Database Control',
      click: function() {
        win.window.location.href = 'tests/database/index.html';
      }
    }));
    developmentMenu.append(new nw.MenuItem({
      label: 'colresizable',
      click: function() {
        win.window.location.href = 'tests/colresizable/link.html';
      }
    }));
    developmentMenu.append(new nw.MenuItem({
      label: 'encryption test',
      click: function() {
        win.window.location.href = 'tests/encrypting/index.html';
      }
    }));
    developmentMenu.append(new nw.MenuItem({
      label: 'mstk test',
      click: function() {
        win.window.location.href = 'tests/area_check/index.html';
      }
    }));
    developmentMenu.append(new nw.MenuItem({
      label: 'stats test',
      click: function() {
        win.window.location.href = 'tests/statistics/index.html';
      }
    }));

    var propertiesMenu = new nw.Menu();
    propertiesMenu.append(new nw.MenuItem({
      label: "Настройки",
      click: function() {
        nw.Window.open('modules/settings/index.html');
      }
    }));
    propertiesMenu.append(new nw.MenuItem({
      label: 'Руководство пользователя',
      click: function() {
        nw.Window.open('res/manual.html',{"width": 1366, "height": 768}, function(win){
          win.maximize();
        });
      }
    }));
    propertiesMenu.append(new nw.MenuItem({
      label: 'О программе',
      click: function() {
        nw.Window.open('modules/about/index.html');
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
      label: "Ресурсы",
      submenu: resourcesMenu
    }));
    main_menu.append(new nw.MenuItem({
      label: 'Разработка',
      submenu: developmentMenu
    }));
    main_menu.append(new nw.MenuItem({
      label: 'Свойства',
      submenu: propertiesMenu
    }));

    win.menu = main_menu;
  });
}
