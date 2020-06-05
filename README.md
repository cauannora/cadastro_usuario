# Cadastro de Usuario

|**Metodo**          | **Rota**         | **Input body** |  **Função** |
|----------------|--------------|------------|------------|
|GET             |`/`           |    N/A     | Lista todos os usuarios do banco |
|POST            |`/`           | { `nome`: **STRING**, `email`: **STRING**, `telefone`: **STRING**} | Cadastra um novo usuario |
|DELETE          |`/{ID}`       |    N/A     | Deleta um usuario apartir do `ID` |
|GET             |`/{ID}`       |    N/A     | Lista um usuario pelo seu `ID` |
|PUT             |`/{ID}`       | { `nome`: **STRING**, `email`: **STRING**, `telefone`: **STRING**} | Atualiza usuario apartir do `ID` |
