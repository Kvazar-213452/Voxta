const { getToken } = require('./component/storage_app');
const { generate_key } = require('./component/crypto_func');
const { getMainWindow } = require('./castile/mainWindow');

async function check_app() {
    const tokenExists = await getToken();
    const mainWindow = getMainWindow();

    if (!tokenExists) {
        await generate_key();
        mainWindow.loadFile("src/web/login.html");
        // mainWindow.webContents.send('web', { message: 'Користувач не залогінений' });
    }

    console.log(tokenExists);
}

module.exports = { check_app };
