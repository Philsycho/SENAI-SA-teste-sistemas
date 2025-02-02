<?php
// No início de cada arquivo PHP na pasta public
include '../includes/conexao.php';

session_start();

if (!isset($_SESSION['logado'])) {
    header("location: login.php");
    exit;
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("location: login.php");
    exit;
}

$search_field = isset($_POST['search_field']) ? $_POST['search_field'] : '';
$search_value = isset($_POST['search_value']) ? $_POST['search_value'] : '';

$sql = "SELECT * FROM formulario";
if ($search_field && $search_value) {
    $sql .= " WHERE $search_field LIKE '%$search_value%'";
}

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Visualização dos Formulários</title>
    <link rel="stylesheet" href="estilo.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script>
    $(document).ready(function() {
        $('#search_field').change(function() {
            var field = $(this).val();
            var input = $('#search_value');
            input.val(''); // Clear the input value
            input.unmask(); // Remove any previous mask
            input.prop('type', 'text'); // Default input type

            if (field === 'cep' || field === 'telefone' || field === 'cpfcnpj') {
                input.prop('type', 'text');
                if (field === 'cep') {
                    input.mask('00000-000');
                } else if (field === 'telefone') {
                    input.mask('(00) 0000-0000');
                } else if (field === 'cpfcnpj') {
                    input.mask('000.000.000-00');
                }
            } else if (field === 'data_compra') {
                input.prop('type', 'date');
            } else {
                input.prop('type', 'text');
            }
        });
    });
    </script>
</head>
<body>
    <a href="visualizar.php?logout=true" class="logout-button">Sair</a>
    <h1>Formulários Submetidos</h1>
    <form method="post" action="visualizar.php">
        <label for="search_field">Campo de Pesquisa:</label>
        <select id="search_field" name="search_field">
            <option value="">Selecione</option>
            <option value="nome_completo">Nome Completo</option>
            <option value="telefone">Telefone</option>
            <option value="email">Email</option>
            <option value="cpfcnpj">CPF/CNPJ</option>
            <option value="endereco">Endereço</option>
            <option value="cep">CEP</option>
            <option value="cidade">Cidade</option>
            <option value="estado">Estado</option>
            <option value="data_compra">Data da Compra</option>
            <option value="mensagem">Mensagem</option>
        </select>

        <label for="search_value">Valor de Pesquisa:</label>
        <input type="text" id="search_value" name="search_value">

        <input type="submit" value="Pesquisar">
    </form>

    <table>
        <thead>
            <tr>
                <th>Nome Completo</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>CPF/CNPJ</th>
                <th>Endereço</th>
                <th>CEP</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Data da Compra</th>
                <th>Mensagem</th>
                <th>Documento</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row['nome_completo'] . "</td>";
                    echo "<td>" . $row['telefone'] . "</td>";
                    echo "<td>" . $row['email'] . "</td>";
                    echo "<td>" . $row['cpfcnpj'] . "</td>";
                    echo "<td>" . $row['endereco'] . "</td>";
                    echo "<td>" . $row['cep'] . "</td>";
                    echo "<td>" . $row['cidade'] . "</td>";
                    echo "<td>" . $row['estado'] . "</td>";
                    echo "<td>" . $row['data_compra'] . "</td>";
                    echo "<td>" . $row['mensagem'] . "</td>";
                    echo "<td><a href='" . $row['document'] . "' target='_blank'>Ver Documento</a></td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='11'>Nenhum formulário encontrado.</td></tr>";
            }
            $conn->close();
            ?>
        </tbody>
    </table>
</body>
</html>
