const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

//#region Utilitários
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escolherAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}
//#endregion

//#region Geradores de Dados
function gerarNomeCompleto() {
    return `${escolherAleatorio(["Ana", "Bruno", "Carlos", "Daniela", "Eduardo"])} ${escolherAleatorio(["Silva", "Santos", "Oliveira"])}`;
}

function gerarTelefone() {
    return `(${Math.floor(Math.random() * 90 + 10)}) ${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function gerarEmail() {
    return `${escolherAleatorio(["usuario1", "usuario2", "usuario3"])}@${escolherAleatorio(["teste.com", "dominio.com"])}`;
}

function gerarCep() {
    return `${Math.floor(Math.random() * 90000 + 10000)}-${Math.floor(Math.random() * 900 + 100)}`;
}

function gerarEstado() {
    return escolherAleatorio(["SP", "RJ", "MG", "BA", "PR"]);
}

function gerarCidade() {
    return escolherAleatorio(["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Curitiba"]);
}

function gerarDataAleatoria() {
    const ano = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
    const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}
//#endregion

async function preencherFormulario(vezes, pausa) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();

    try {
        await driver.get('http://127.0.0.1:5500/public/formulario.html');

        for (let i = 0; i < vezes; i++) {
            console.log(`Preenchendo formulário ${i + 1} de ${vezes}...`);

            const campos = {
                'nome_completo': gerarNomeCompleto(),
                'telefone': gerarTelefone(),
                'email': gerarEmail(),
                'cep': gerarCep(),
                'endereco': `Endereço ${i}`,
                'cidade': gerarCidade(),
                'estado': gerarEstado(),
                'data_compra': gerarDataAleatoria(),
                'mensagem': `Mensagem ${i}`
            };

            for (let id in campos) {
                let elemento = await driver.findElement(By.id(id));
                await elemento.clear();
                await elemento.sendKeys(campos[id]);
            }

            await driver.findElement(By.css('input[type="submit"]')).click();

            // Aceitar alerta
            await driver.wait(until.alertIsPresent(), 5000);
            let alert = await driver.switchTo().alert();
            await alert.accept();

            await delay(pausa);
        }
    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    } finally {
        await driver.quit();
    }
}

//#region Entrada do Usuário
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Quantas vezes deseja executar a automação? ', (resposta) => {
    const vezes = parseInt(resposta);
    if (isNaN(vezes) || vezes <= 0) return console.log('Número inválido.');

    rl.question('Tempo de pausa entre preenchimentos (ms): ', (pausaResposta) => {
        const pausa = parseInt(pausaResposta);
        if (isNaN(pausa) || pausa < 0) return console.log('Valor inválido.');

        preencherFormulario(vezes, pausa)
            .then(() => console.log('Automação concluída.'))
            .catch(err => console.error('Erro:', err))
            .finally(() => rl.close());
    });
});
