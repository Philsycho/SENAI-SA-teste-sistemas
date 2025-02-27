const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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

function gerarCPF() {
    function gerarDigito(cpf) {
        let soma = 0;
        for (let i = 0; i < cpf.length; i++) {
            soma += cpf[i] * (cpf.length + 1 - i);
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    const cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    cpf.push(gerarDigito(cpf));
    cpf.push(gerarDigito(cpf));

    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function gerarNomeArquivo() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');
    return `${ano}${mes}${dia}_${hora}${minuto}${segundo}_relatorio.txt`;
}

function selecionarPDFAleatorio() {
    const diretorioPDFs = path.join(__dirname, 'pdfs-teste');
    const arquivosPDF = fs.readdirSync(diretorioPDFs).filter(file => file.endsWith('.pdf'));

    if (arquivosPDF.length === 0) {
        throw new Error('Nenhum arquivo PDF encontrado na pasta "pdfs-teste".');
    }

    const arquivoSelecionado = arquivosPDF[Math.floor(Math.random() * arquivosPDF.length)];
    return path.join(diretorioPDFs, arquivoSelecionado);
}
//#endregion

async function preencherFormulario(vezes, pausa) {
    console.log('Iniciando automação...');
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    console.log('Driver do Chrome inicializado.');

    const relatorio = [];
    const nomeArquivo = gerarNomeArquivo();

    try {
        console.log('Acessando a página do formulário...');
        await driver.get('http://127.0.0.1:5500/public/formulario.html');
        console.log('Página do formulário carregada.');

        for (let i = 0; i < vezes; i++) {
            console.log(`\nPreenchendo formulário ${i + 1} de ${vezes}...`);
            relatorio.push(`Formulário ${i + 1} de ${vezes}:`);

            const campos = {
                'nome_completo': gerarNomeCompleto(),
                'telefone': gerarTelefone(),
                'email': gerarEmail(),
                'cpfcnpj': gerarCPF(),
                'cep': gerarCep(),
                'endereco': `Endereço ${i}`,
                'cidade': gerarCidade(),
                'estado': gerarEstado(),
                'data_compra': gerarDataAleatoria(),
                'mensagem': `Mensagem ${i}`
            };

            for (let id in campos) {
                console.log(`Preenchendo campo ${id} com valor: ${campos[id]}`);
                relatorio.push(`  ${id}: ${campos[id]}`);
                let elemento = await driver.findElement(By.id(id));
                await elemento.clear();
                await delay(500);
                await elemento.sendKeys(campos[id]);
                await delay(500);
                console.log(`Campo ${id} preenchido com sucesso.`);
            }

            // Selecionar e enviar um PDF aleatório
            const caminhoPDF = selecionarPDFAleatorio();
            console.log(`Selecionando arquivo PDF: ${caminhoPDF}`);
            const inputArquivo = await driver.findElement(By.id('document'));
            await inputArquivo.sendKeys(caminhoPDF);
            await delay(1000);
            console.log('Arquivo PDF selecionado.');

            console.log('Clicando no botão de enviar...');
            await driver.findElement(By.css('input[type="submit"]')).click();
            await delay(1000);
            console.log('Botão de enviar clicado.');

            // Fechar o alerta
            console.log('Aguardando alerta...');
            await driver.wait(until.alertIsPresent(), 5000);
            let alert = await driver.switchTo().alert();
            console.log('Alerta detectado. Aceitando alerta...');
            await alert.accept();
            console.log('Alerta aceito.');

            console.log(`Aguardando ${pausa}ms antes do próximo preenchimento...`);
            await delay(pausa);
        }
    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
        relatorio.push(`Erro: ${error.message}`);
    } finally {
        console.log('Finalizando automação...');
        await driver.quit();
        console.log('Driver do Chrome encerrado.');

        // Escreve o relatório em um arquivo TXT
        fs.writeFileSync(nomeArquivo, relatorio.join('\n'));
        console.log(`Relatório salvo em ${nomeArquivo}`);
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
