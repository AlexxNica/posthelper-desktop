loadApp();

function loadApp() {
    nw.Window.open('index.html', {}, function(win) {
    win.maximize();
    var main_menu = new nw.Menu({ type: 'menubar' });

    var functionsMenu = new nw.Menu();
    functionsMenu.append(new nw.MenuItem({
        label: 'Возвраты',
        click: function() {
            win.window.location.href = './res/returns/index.html';
        }
    }));
    functionsMenu.append(new nw.MenuItem({
        label: 'Вторичные извещения',
        click: function() {
            win.window.location.href = './res/secondaries/index.html';
        }
    }));
    functionsMenu.append(new nw.MenuItem({
        label: 'Телефонные коды',
        click: function() {
            win.window.location.href = './res/phonecodes/index.html';
        }
    }));
    functionsMenu.append(new nw.MenuItem({
        label: 'Мелкие пакеты',
        click: function() {
            win.window.location.href = './res/packet_print/index.html';
        }
    }));

    var experimentalMenu = new nw.Menu();
    experimentalMenu.append(new nw.MenuItem({
        label: 'DB Test',
        click: function() {
            if (confirm("Данная функция находится в активной разработке и может быть нестабильной. Продолжить?")) {
                win.window.location.href = './res/dbtest/index.html';
            }
        }
    }));

    var propertiesMenu = new nw.Menu();
    propertiesMenu.append(new nw.MenuItem({ 
        label: 'О программе',
        click: function() {
            nw.Window.open('res/about/index.html');
        } 
    }));

    main_menu.append(new nw.MenuItem({
        label: 'Функции',
        submenu: functionsMenu
    }));
    main_menu.append(new nw.MenuItem({
        label: 'Экспериментальные функции',
        submenu: experimentalMenu
    }));
    main_menu.append(new nw.MenuItem({
        label: 'Свойства',
        submenu: propertiesMenu
    }));

    win.menu = main_menu;
});
}