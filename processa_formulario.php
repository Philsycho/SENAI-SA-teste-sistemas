<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "teste_sistema";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome_completo = $_POST['nome_completo'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $cpfcnpj = $_POST['cpfcnpj'];
    $cep = $_POST['cep'];
    $endereco = $_POST['endereco'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $data_compra = $_POST['data_compra'];
    $mensagem = $_POST['mensagem'];
    $document = $_FILES['document']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($document);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Verifica se o arquivo é uma imagem
    $check = getimagesize($_FILES["document"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        echo "Arquivo não é uma imagem.";
        $uploadOk = 0;
    }

    // Verifica o tamanho do arquivo
    if ($_FILES["document"]["size"] > 500000) {
        echo "Desculpe, seu arquivo é muito grande.";
        $uploadOk = 0;
    }

    // Permite apenas certos formatos de arquivo
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
        echo "Desculpe, apenas arquivos JPG, JPEG e PNG são permitidos.";
        $uploadOk = 0;
    }

    // Verifica se $uploadOk está definido como 0 por um erro
    if ($uploadOk == 0) {
        echo "Desculpe, seu arquivo não foi enviado.";
    // Se tudo estiver ok, tenta fazer o upload do arquivo
    } else {
        if (move_uploaded_file($_FILES["document"]["tmp_name"], $target_file)) {
            $sql = "INSERT INTO formulario (nome_completo, telefone, email, cpfcnpj, cep, endereco, cidade, estado, data_compra, mensagem, document)
            VALUES ('$nome_completo', '$telefone', '$email', '$cpfcnpj', '$cep', '$endereco', '$cidade', '$estado', '$data_compra', '$mensagem', '$target_file')";

            if ($conn->query($sql) === TRUE) {
                echo "Registro inserido com sucesso!";
            } else {
                echo "Erro: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "Desculpe, houve um erro ao enviar seu arquivo.";
        }
    }
}

$conn->close();
?>