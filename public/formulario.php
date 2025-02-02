<?php
// No início de cada arquivo PHP na pasta public
include '../includes/conexao.php';

$success = false;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome_completo = $_POST['nome_completo'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $cpfcnpj = $_POST['cpfcnpj'];
    $endereco = $_POST['endereco'];
    $cep = $_POST['cep'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $data_compra = $_POST['data_compra'];
    $mensagem = $_POST['mensagem'];

    // Upload do documento
    $document = $_FILES['document']['name'];
    $document_tmp = $_FILES['document']['tmp_name'];
    $document_size = $_FILES['document']['size'];
    $document_ext = strtolower(pathinfo($document, PATHINFO_EXTENSION));
    $allowed_ext = array('pdf');

    if (in_array($document_ext, $allowed_ext) && $document_size <= 10485760) { // 10MB em bytes
        $document_base = pathinfo($document, PATHINFO_FILENAME);
        $document_path = "uploads/" . $document_base . "." . $document_ext;

        $counter = 1;
        while (file_exists($document_path)) {
            $document_path = "uploads/" . $document_base . " (" . $counter . ")." . $document_ext;
            $counter++;
        }

        move_uploaded_file($document_tmp, $document_path);

        $sql = "INSERT INTO formulario (nome_completo, telefone, email, cpfcnpj, endereco, cep, cidade, estado, data_compra, mensagem, document)
        VALUES ('$nome_completo', '$telefone', '$email', '$cpfcnpj', '$endereco', '$cep', '$cidade', '$estado', '$data_compra', '$mensagem', '$document_path')";

        if ($conn->query($sql) === TRUE) {
            $success = true;
        } else {
            echo "Erro: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Erro: Apenas arquivos PDF são permitidos e o tamanho máximo é de 10MB.";
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Formulário</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script>
    $(document).ready(function(){
        $('#telefone').mask('(00) 0000-0000');
        $('#cpfcnpj').mask('000.000.000-00'); // Para CPF
        $('#cep').mask('00000-000');
    });

    <?php if ($success): ?>
    alert("Dados inseridos com sucesso!");
    <?php endif; ?>
    </script>
</head>
<body>
    <form method="post" action="formulario.php" enctype="multipart/form-data">
        <label for="nome_completo">Nome Completo:</label>
        <input type="text" id="nome_completo" name="nome_completo" required><br>

        <label for="telefone">Telefone:</label>
        <input type="text" id="telefone" name="telefone" required><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br>

        <label for="cpfcnpj">CPF/CNPJ:</label>
        <input type="text" id="cpfcnpj" name="cpfcnpj" required><br>

        <label for="endereco">Endereço:</label>
        <input type="text" id="endereco" name="endereco" required><br>

        <label for="cep">CEP:</label>
        <input type="text" id="cep" name="cep" required><br>

        <label for="cidade">Cidade:</label>
        <input type="text" id="cidade" name="cidade" required><br>

        <label for="estado">Estado:</label>
        <input type="text" id="estado" name="estado" required><br>

        <label for="data_compra">Data da Compra:</label>
        <input type="date" id="data_compra" name="data_compra" required><br>

        <label for="mensagem">Mensagem:</label>
        <input type="text" id="mensagem" name="mensagem"><br>

        <label for="document">Documento (PDF, até 10MB):</label>
        <input type="file" id="document" name="document" accept="application/pdf" required><br>

        <input type="submit" value="Enviar">
    </form>
</body>
</html>
