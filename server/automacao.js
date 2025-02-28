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
    const ano = Math.floor(Math.random() * (2024 - 1900 + 1)) + 1900;
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

function gerarMensagemAleatoria() {
    const mensagens = [
        "Solicito informações adicionais sobre o produto.",
        "Gostaria de fazer uma reclamação sobre o serviço.",
        "Preciso de suporte técnico para o equipamento.",
        "Desejo cancelar minha assinatura.",
        "Quero elogiar o atendimento recebido.",
        "Preciso de ajuda para configurar meu dispositivo.",
        "Gostaria de saber mais sobre as garantias oferecidas.",
        "Solicito um orçamento para o serviço.",
        "Preciso de informações sobre políticas de devolução.",
        "Gostaria de fazer uma sugestão para melhorar o produto."
    ];
    return escolherAleatorio(mensagens);
}
//#endregion

// Configuração do Chrome
const options = new chrome.Options();
options.setAlertBehavior('accept'); // Aceita automaticamente os alertas do navegador

async function preencherFormulario(vezes, pausa) {
    console.log('Iniciando automação...');
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    console.log('Driver do Chrome inicializado.');

    const relatorio = [];
    const nomeArquivo = gerarNomeArquivo();

    try {
        // Primeiro, fazer login
        console.log('Acessando a página de login...');
        await driver.get('http://127.0.0.1:5500/public/login.html');
        console.log('Página de login carregada.');

        // Preencher campos de login
        console.log('Preenchendo formulário de login...');
        await driver.findElement(By.id('nome_usuario')).sendKeys('adm@adm.com.br');
        await delay(500);
        await driver.findElement(By.id('senha')).sendKeys('KTG6MghgiBF$Nn9SL5');
        await delay(500);

        // Clicar no botão de login
        console.log('Clicando no botão de login...');
        await driver.findElement(By.css('input[type="submit"]')).click();
        await delay(1000);

        // Fechar o alerta de mudança de senha do navegador
        console.log('Fechando alerta de mudança de senha...');
        try {
            await driver.wait(until.alertIsPresent(), 5000);
            let alert = await driver.switchTo().alert();
            await alert.accept();
            console.log('Alerta de mudança de senha fechado.');
        } catch (error) {
            console.log('Nenhum alerta de mudança de senha presente.');
        }

        // Aguardar redirecionamento para formulario.html
        console.log('Aguardando redirecionamento para formulario.html...');
        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/formulario.html'), 5000);
        console.log('Redirecionado para formulario.html com sucesso!');

        for (let i = 0; i < vezes; i++) {
            // Adiciona uma separação clara no relatório
            relatorio.push(`\n========== TESTE ${i + 1} ==========`);
            relatorio.push(`Data e Hora: ${new Date().toLocaleString()}`);
            relatorio.push('Dados preenchidos:');
            
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
                'mensagem': gerarMensagemAleatoria()
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
        console.error('Erro durante a automação:', error);
        relatorio.push(`\nErro: ${error.message}`);
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
