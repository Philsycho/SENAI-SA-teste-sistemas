const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost/SENAI-SA-teste-sistemas/public/formulario.php';
const logFilePath = path.join(__dirname, 'automation_log.txt');
const chromeDriverPath = 'C:/caminho/para/o/chromedriver.exe'; // Atualize com o caminho do seu ChromeDriver

async function preencherFormulario() {
    let service = new chrome.ServiceBuilder(chromeDriverPath).build();
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .build();
    let tentativa = 1;

    try {
        // Abrir a página do formulário
        await driver.get(url);
        log(`Tentativa ${tentativa}: Acessando ${url}`);

        // Dados falsos para preenchimento
        const dados = {
            nome_completo: faker.name.findName(),
            telefone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            cpfcnpj: faker.finance.account(),
            endereco: faker.address.streetAddress(),
            cep: faker.address.zipCode(),
            cidade: faker.address.city(),
            estado: faker.address.state(),
            data_compra: faker.date.past().toISOString().split('T')[0],
            mensagem: faker.lorem.sentence()
        };

        // Preencher os campos do formulário
        await driver.findElement(By.id('nome_completo')).sendKeys(dados.nome_completo);
        await driver.findElement(By.id('telefone')).sendKeys(dados.telefone);
        await driver.findElement(By.id('email')).sendKeys(dados.email);
        await driver.findElement(By.id('cpfcnpj')).sendKeys(dados.cpfcnpj);
        await driver.findElement(By.id('endereco')).sendKeys(dados.endereco);
        await driver.findElement(By.id('cep')).sendKeys(dados.cep);
        await driver.findElement(By.id('cidade')).sendKeys(dados.cidade);
        await driver.findElement(By.id('estado')).sendKeys(dados.estado);
        await driver.findElement(By.id('data_compra')).sendKeys(dados.data_compra);
        await driver.findElement(By.id('mensagem')).sendKeys(dados.mensagem);

        // Enviar o formulário
        await driver.findElement(By.css('input[type="submit"]')).click();

        log(`Tentativa ${tentativa} bem-sucedida:\n${JSON.stringify(dados, null, 2)}`);
    } catch (error) {
        log(`Tentativa ${tentativa} falhou: ${error.message}`);
    } finally {
        await driver.quit();
    }
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erro ao escrever no arquivo de log:', err);
        }
    });
}

// Execute o script de automação
preencherFormulario();
