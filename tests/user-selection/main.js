let selectedUserId = 0;

const users = {
  '1': {
    id: '1',
    name: 'Администратор',
    password: 'admin123'
  },
  '2': {
    id: '2',
    name: 'Пользователь 1',
    password: '123'
  }
};

function initModule() {
  const ids = Object.keys(users);
  const options = [];
  for (let id = 0; id < ids.length; ++id) {
    options.push(
      `<option value="${users[ids[id]].id}">
        ${users[ids[id]].name}
      </option>`
    );
  }

  $('#userSelect')
    .append(options.join(''))
    .selectmenu();

  $('#loginForm').resizable();

  $('#loginButton').button().click((event) => {
    if (users[$('#userSelect').val()].password === $('#passwordInput').val()) {
      alert('Вход выполнен');
    } else {
      alert('Ошибка: неправильный пароль');
    }
  });
}