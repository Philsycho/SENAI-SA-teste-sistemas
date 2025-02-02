<?php
include 'conexao.php';

$success = false;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome_completo = $_POST['nome_completo'];
    $nome_usuario = $_POST['nome_usuario'];
    $email = $_POST['email'];
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // Criptografar a senha

    $sql = "INSERT INTO usuarios (nome_completo, nome_usuario, email, senha)
    VALUES ('$nome_completo', '$nome_usuario', '$email', '$senha')";

    if ($conn->query($sql) === TRUE) {
        $success = true;
    } else {
        echo "Erro: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Registro de Usuário</title>
    <link rel="stylesheet" href="estilo.css">
    <script>
    <?php if ($success): ?>
    alert("Registro efetuado com sucesso!");
    <?php endif; ?>
    </script>
</head>
<body>
    <h1>Registro de Usuário</h1>
    <form method="post" action="registro.php">
        <label for="nome_completo">Nome Completo:</label>
        <input type="text" id="nome_completo" name="nome_completo" required><br>

        <label for="nome_usuario">Nome de Usuário:</label>
        <input type="text" id="nome_usuario" name="nome_usuario" required><br>

        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required><br>

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required><br>

        <input type="submit" value="Registrar">
    </form>
</body>
</html>
