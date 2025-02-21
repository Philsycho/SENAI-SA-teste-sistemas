const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//#region Nome Completo
function gerarNomeCompleto() {
    const nomes = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Juliana"];
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Pereira", "Costa", "Rodrigues", "Almeida", "Nascimento", "Lima", "Gomes"];

    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];

    return `${nome} ${sobrenome}`;
}
//#endregion

//#region Telefone
function gerarTelefone() {
    const ddd = Math.floor(Math.random() * 90 + 10); // Gera um DDD entre 10 e 99
    const parte1 = Math.floor(Math.random() * 9000 + 1000); // Gera a primeira parte do número (4 dígitos)
    const parte2 = Math.floor(Math.random() * 9000 + 1000); // Gera a segunda parte do número (4 dígitos)
    return `(${ddd}) ${parte1}-${parte2}`;
}
//#endregion

//#region E-mail
function gerarEmail() {
    const nomesUsuario = ["usuario1", "usuario2", "usuario3", "usuario4", "usuario5"];
    const dominios = ["exemplo.com", "teste.com", "email.com", "dominio.com", "site.com"];

    const nomeUsuario = nomesUsuario[Math.floor(Math.random() * nomesUsuario.length)];
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];

    return `${nomeUsuario}@${dominio}`;
}
//#endregion

//#region CPF/CNPJ
function gerarCpfCnpj() {
    const tipo = Math.random() < 0.5 ? 'CPF' : 'CNPJ';
    return tipo === 'CPF' ? gerarCpf() : gerarCnpj();
}

function gerarCpf() {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }
    cpf += calcularDigitoVerificadorCpf(cpf);
    return cpf;
}

function calcularDigitoVerificadorCpf(cpf) {
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    let digito1 = resto;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    let digito2 = resto;

    return `${digito1}${digito2}`;
}

function gerarCnpj() {
    let cnpj = '';
    for (let i = 0; i < 12; i++) {
        cnpj += Math.floor(Math.random() * 10);
    }
    cnpj += calcularDigitoVerificadorCnpj(cnpj);
    return cnpj;
}

function calcularDigitoVerificadorCnpj(cnpj) {
    let soma = 0;
    let pos = 5;

    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    soma = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    return `${digito1}${digito2}`;
}
//#endregion

//#region CEP
function gerarCep() {
    const parte1 = Math.floor(Math.random() * 90000 + 10000); // Gera a primeira parte do CEP (5 dígitos)
    const parte2 = Math.floor(Math.random() * 900 + 100); // Gera a segunda parte do CEP (3 dígitos)
    return `${parte1}-${parte2}`;
}
//#endregion

//#region Estado
function gerarEstado() {
    const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
    return estados[Math.floor(Math.random() * estados.length)];
}
//#endregion

//#region Cidade
function gerarCidade() {
    const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador", "Fortaleza", "Curitiba", "Manaus", "Recife", "Porto Alegre"];
    return cidades[Math.floor(Math.random() * cidades.length)];
}
//#endregion

//#region Data de Compra
function gerarDataAleatoria() {
    const anoInicio = 2000;
    const anoFim = 2025;
    const ano = Math.floor(Math.random() * (anoFim - anoInicio + 1)) + anoInicio;
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 28) + 1; // Para simplificar, consideramos até 28 dias

    const mesFormatado = mes.toString().padStart(2, '0');
    const diaFormatado = dia.toString().padStart(2, '0');

    return `${ano}-${mesFormatado}-${diaFormatado}`;
}
//#endregion

async function preencherFormulario(vezes, pausa) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();

    try {
        await driver.get('http://127.0.0.1:5500/public/formulario.html');

        for (let i = 0; i < vezes; i++) {
            console.log(`Preenchendo formulário ${i + 1} de ${vezes}...`);

            await driver.wait(until.elementLocated(By.id('nome_completo')), 10000);
            await driver.findElement(By.id('nome_completo')).clear();
            await driver.findElement(By.id('nome_completo')).sendKeys(gerarNomeCompleto());
            await driver.findElement(By.id('telefone')).clear();
            await driver.findElement(By.id('telefone')).sendKeys(gerarTelefone());
            await driver.findElement(By.id('email')).clear();
            await driver.findElement(By.id('email')).sendKeys(gerarEmail());
            await driver.findElement(By.id('cpfcnpj')).clear();
            await driver.findElement(By.id('cpfcnpj')).sendKeys(gerarCpfCnpj());
            await driver.findElement(By.id('cep')).clear();
            await driver.findElement(By.id('cep')).sendKeys(gerarCep());
            await driver.findElement(By.id('endereco')).clear();
            await driver.findElement(By.id('endereco')).sendKeys(`Endereço ${i}`);
            await driver.findElement(By.id('cidade')).clear();
            await driver.findElement(By.id('cidade')).sendKeys(gerarCidade());
            await driver.findElement(By.id('estado')).clear();
            await driver.findElement(By.id('estado')).sendKeys(gerarEstado());
            await driver.findElement(By.id('data_compra')).sendKeys(gerarDataAleatoria());
            await driver.findElement(By.id('mensagem')).clear();
            await driver.findElement(By.id('mensagem')).sendKeys(`Mensagem ${i}`);

            await driver.findElement(By.css('input[type="submit"]')).click();

            // Aceitar o alerta após enviar o formulário
            await driver.wait(until.alertIsPresent(), 10000);
            let alert = await driver.switchTo().alert();
            await alert.accept();

            // Pausa entre os preenchimentos
            await delay(pausa);
        }
    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    } finally {
        await driver.quit();
    }
}

// Função para obter a entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Quantas vezes deseja executar a automação? ', (resposta) => {
    const vezes = parseInt(resposta);
    if (isNaN(vezes) || vezes <= 0) {
        console.log('Por favor, insira um número válido.');
        rl.close();
    } else {
        rl.question('Digite o tempo de pausa entre os preenchimentos (em milissegundos): ', (pausaResposta) => {
            const pausa = parseInt(pausaResposta);
            if (isNaN(pausa) || pausa < 0) {
                console.log('Por favor, insira um número válido para a pausa.');
                rl.close();
            } else {
                preencherFormulario(vezes, pausa).then(() => {
                    console.log('Automação concluída.');
                    rl.close();
                }).catch(err => {
                    console.error('Erro ao executar a automação:', err);
                    rl.close();
                });
            }
        });
    }
});