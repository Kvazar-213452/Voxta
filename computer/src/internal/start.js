const { getToken } = require('./storage_app');
const { getMainWindow } = require('./castile/mainWindow');

async function check_app() {
    const tokenExists = await getToken();
    const mainWindow = getMainWindow();

    if (!tokenExists) {
        mainWindow.loadFile("src/web/login.html");
        mainWindow.webContents.send('web', { message: 'Користувач не залогінений' });
    }

    console.log(tokenExists);
}

module.exports = { check_app };
