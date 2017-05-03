/* global nw */

nw.Window.open('modules/login/index.html');

function loadApp() {
    nw.Window.open('index.html', {"width": 1366, "height": 768}, function(win) {
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

        var propertiesMenu = new nw.Menu();
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
            label: 'Свойства',
            submenu: propertiesMenu
        }));

        win.menu = main_menu;
    });
};

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
            label: 'Базы даннных',
            click: function() {
                win.window.location.href = './modules/dbtest/index.html';
            }
        }));
        developmentMenu.append(new nw.MenuItem({
            label: 'colresizable',
            click: function() {
                win.window.location.href = './modules/link_test/link.html';
            }
        }));
        developmentMenu.append(new nw.MenuItem({
            label: 'encryption test',
            click: function() {
                win.window.location.href = './modules/enc_test/index.html';
            }
        }));

        var propertiesMenu = new nw.Menu();
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
};