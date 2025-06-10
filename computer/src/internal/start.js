const { getToken } = require('./storage_app');

async function check_app(mainWindow) {
    const tokenExists = await getToken();

    if (!tokenExists) {
        mainWindow.webContents.send('web', { message: 'Користувач не залогінений' });
    }

    console.log(tokenExists);
}

module.exports = { check_app };
