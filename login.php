<?php
include 'conexao.php';

session_start();
$login_err = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome_usuario = $_POST['nome_usuario'];
    $senha = $_POST['senha'];

    $sql = "SELECT * FROM usuarios WHERE nome_usuario = '$nome_usuario'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if (password_verify($senha, $row['senha'])) {
            $_SESSION['logado'] = true;
            $_SESSION['nome_usuario'] = $nome_usuario;
            header("location: visualizar.php");
        } else {
            $login_err = "Senha incorreta.";
        }
    } else {
        $login_err = "Usuário não encontrado.";
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="estilo.css">
    <script>
    <?php if ($login_err): ?>
    alert("<?php echo $login_err; ?>");
    <?php endif; ?>
    </script>
</head>
<body>
    <h1>Login</h1>
    <form method="post" action="login.php">
        <label for="nome_usuario">Nome de Usuário:</label>
        <input type="text" id="nome_usuario" name="nome_usuario" required><br>

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required><br>

        <input type="submit" value="Entrar">
    </form>
</body>
</html>
