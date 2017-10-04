/** @namespace nw */

const fs = require('fs');
const path = require('path');
try {
  const configFile = fs.readFileSync(path.join(nw.App.dataPath, 'PH Configuration'), 'utf-8');
  global.config = JSON.parse(configFile);
  nw.Window.open('modules/login/index.html', { 'show': false });
} catch (e) {
  alert('Ошибка: не найден файл конфигурации\n' + e.toString() + '\n\n' + e.stack);
  nw.Window.open('', { show: false });
  nw.App.quit();
}

function loadApp(usertype) {
  nw.Window.open('index.html', {'show': false}, (win) => {
    win.maximize();
    const mainMenu = new nw.Menu({ type: 'menubar' });

    const windowMenu = new nw.Menu();
    windowMenu.append(new nw.MenuItem({
      label: 'Новое окно',
      click: () => {
        if (usertype === 'admin') {
          loadApp('admin');
        } else {
          loadApp('user');
        }
      }
    }));

    const functionsMenu = new nw.Menu();
    const additionalFunctionsMenu = new nw.Menu();
    const statisticsFunctionsMenu = new nw.Menu();

    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Возвраты',
      click: () => {
        win.window.location.href = './modules/returns/index.html';
      }
    }));
    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Вторичные извещения',
      click: () => {
        win.window.location.href = './modules/secondaries/index.html';
      }
    }));
    additionalFunctionsMenu.append(new nw.MenuItem({
      label: 'Телефонные коды',
      click: () => {
        win.window.location.href = './modules/phonecodes/index.html';
      }
    }));

    statisticsFunctionsMenu.append(new nw.MenuItem({
      label: 'Остатки хранения',
      click: () => {
        win.window.location.href = './modules/storage-remainder/index.html';
      }
    }));

    functionsMenu.append(new nw.MenuItem({
      label: 'Мелкие пакеты',
      click: () => {
        win.window.location.href = './modules/packet-print/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Ярлыки на возврат',
      click: () => {
        win.window.location.href = './modules/f20-print/index.html';
      }
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Статистика',
      submenu: statisticsFunctionsMenu
    }));
    functionsMenu.append(new nw.MenuItem({
      label: 'Дополнительные',
      submenu: additionalFunctionsMenu
    }));

    const developmentMenu = new nw.Menu();
    const developmentTestsMenu = new nw.Menu();

    developmentTestsMenu.append(new nw.MenuItem({
      label: 'Database Control',
      click: () => {
        win.window.location.href = 'tests/database/index.html';
      }
    }));
    developmentTestsMenu.append(new nw.MenuItem({
      label: 'colresizable',
      click: () => {
        win.window.location.href = 'tests/colresizable/index.html';
      }
    }));
    developmentTestsMenu.append(new nw.MenuItem({
      label: 'encryption test',
      click: () => {
        win.window.location.href = 'tests/encrypting/index.html';
      }
    }));
    developmentTestsMenu.append(new nw.MenuItem({
      label: 'mstk test',
      click: () => {
        win.window.location.href = 'tests/area_check/index.html';
      }
    }));
    developmentTestsMenu.append(new nw.MenuItem({
      label: 'stats test',
      click: () => {
        win.window.location.href = 'tests/statistics/index.html';
      }
    }));

    developmentMenu.append(new nw.MenuItem({
      label: 'Тесты',
      submenu: developmentTestsMenu
    }));

    const propertiesMenu = new nw.Menu();
    propertiesMenu.append(new nw.MenuItem({
      label: 'Руководство пользователя',
      click: () => {
        nw.Window.open('res/manual.html', {}, (win) => {
          win.maximize();
        });
      }
    }));
    propertiesMenu.append(new nw.MenuItem({
      label: 'О программе',
      click: () => {
        nw.Window.open('modules/about/index.html', { 'show': false });
      }
    }));

    mainMenu.append(new nw.MenuItem({
      label: 'Окно',
      submenu: windowMenu
    }));
    mainMenu.append(new nw.MenuItem({
      label: 'Функции',
      submenu: functionsMenu
    }));
    if (usertype === 'admin') {
      mainMenu.append(new nw.MenuItem({
        label: 'Разработка',
        submenu: developmentMenu
      }));
    }
    mainMenu.append(new nw.MenuItem({
      label: 'Свойства',
      submenu: propertiesMenu
    }));

    win.menu = mainMenu;
  });
}
