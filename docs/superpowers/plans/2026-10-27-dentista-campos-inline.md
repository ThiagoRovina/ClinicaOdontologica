# Dentista: Campos CRO e Especialização inline no cadastro

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar CRO e Especialização diretamente no formulário de cadastro de funcionário quando o cargo for DENTISTA, eliminando o redirecionamento para outra tela.

**Architecture:** O backend passa a aceitar `especializacao` e `cro` no `FuncionarioCadastroDTO`; o service usa esses valores em vez de placeholders. O frontend exibe os campos condicionalmente e remove o redirect pós-submit.

**Tech Stack:** Java 17 / Spring Boot, React (Bootstrap), Lombok, Axios

**Spec:** Design acordado em conversa (2026-10-27): campos opcionais no DTO sem `@NotBlank`; validação de obrigatoriedade no frontend (`required`) e fallback vazio no service se nulos.

## Global Constraints

- Campos `especializacao` e `cro` são `String` nullable — sem `@NotBlank` no DTO (outros cargos não os enviam)
- O service já verifica `dto.getCargo() == TipoFuncionario.DENTISTA` antes de criar o registro Dentista
- Não alterar a tela `/dentistas/editar/` existente (pode continuar existindo)
- Não alterar validações de outros cargos

## Review Focus

- Cargo = DENTISTA sem preencher CRO/Especialização: o service deve usar fallback (`""` ou `"A definir"`) sem lançar NullPointerException → coberto no Task 1, Step 4
- Cargo != DENTISTA com campos CRO/Especialização enviados acidentalmente: o service deve ignorá-los (o bloco `if DENTISTA` não executa) → coberto pela lógica existente de `if (dto.getCargo() == TipoFuncionario.DENTISTA)`
- Troca de cargo de DENTISTA para outro no formulário antes de submeter: os campos devem sumir e não ser enviados obrigatórios → coberto no Task 2, Step 2 (verificar required condicional)
- Edição de funcionário existente (modo editar): `isEditMode` não altera o fluxo do `PUT`, que não passa por `cadastrarFuncionarioEUsuario` — sem impacto

---

### Task 1: Backend — aceitar CRO e Especialização no cadastro

**Files:**
- Modify: `ClinicaOdont/src/main/java/com/sistemaClinica/funcionario/dto/FuncionarioCadastroDTO.java`
- Modify: `ClinicaOdont/src/main/java/com/sistemaClinica/funcionario/service/FuncionarioService.java`

**Interfaces:**
- Produces: `FuncionarioCadastroDTO` com campos `String especializacao` e `String cro` (nullable)
- Produces: `FuncionarioService.cadastrarFuncionarioEUsuario` usa `dto.getEspecializacao()` e `dto.getCro()`

- [ ] **Step 1: Adicionar campos ao DTO**

Em `FuncionarioCadastroDTO.java`, adicionar após o campo `telefone`:

```java
private String especializacao;
private String cro;
```

Sem `@NotBlank` — são opcionais para cargos que não são DENTISTA.

- [ ] **Step 2: Verificar que o projeto compila**

```bash
cd ClinicaOdont && ./mvnw compile -q
```
Esperado: BUILD SUCCESS

- [ ] **Step 3: Usar os valores reais no service**

Em `FuncionarioService.java`, dentro do bloco `if (dto.getCargo() == TipoFuncionario.DENTISTA)`, substituir:

```java
// antes
dentista.setEspecializacao("A definir");
dentista.setCro("TEMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
```

por:

```java
// depois
dentista.setEspecializacao(dto.getEspecializacao() != null ? dto.getEspecializacao() : "");
dentista.setCro(dto.getCro() != null ? dto.getCro() : "");
```

- [ ] **Step 4: Verificar que o projeto compila e o teste de contexto passa**

```bash
cd ClinicaOdont && ./mvnw test -pl . -Dtest=ClinicaOdontApplicationTests -q
```
Esperado: BUILD SUCCESS, 1 test passed

- [ ] **Step 5: Remover import não mais utilizado (se houver)**

Verificar se `java.util.UUID` ainda é usado em outro lugar do service. Se não, remover o import.

- [ ] **Step 6: Commit**

```bash
git add ClinicaOdont/src/main/java/com/sistemaClinica/funcionario/dto/FuncionarioCadastroDTO.java
git add ClinicaOdont/src/main/java/com/sistemaClinica/funcionario/service/FuncionarioService.java
git commit -m "feat: aceitar especializacao e cro no cadastro de dentista"
```

---

### Task 2: Frontend — campos condicionais e remoção do redirect

**Files:**
- Modify: `frontend/src/Funcionario/FuncionarioCadastro.js`

**Interfaces:**
- Consumes: `POST /api/funcionarios/cadastrar` — o body já aceita `especializacao` e `cro` (Task 1)
- O estado local passa a incluir `especializacao: ''` e `cro: ''`

- [ ] **Step 1: Adicionar campos ao estado inicial**

No `useState` do `funcionario` (linha 13), acrescentar `especializacao: ''` e `cro: ''`:

```js
const [funcionario, setFuncionario] = useState({
    nmFuncionario: '', nuMatricula: '', cargo: '', dataAdmissao: '',
    email: '', telefone: '', senha: '', confirmarSenha: '',
    especializacao: '', cro: ''
});
```

- [ ] **Step 2: Adicionar bloco condicional de campos no JSX**

Após o `<div>` do campo Telefone (col-md-6, linha ~121), adicionar:

```jsx
{funcionario.cargo === 'DENTISTA' && (
    <>
        <div className="col-md-6">
            <Form.Label className="fw-medium small">CRO</Form.Label>
            <Form.Control
                type="text"
                name="cro"
                value={funcionario.cro}
                onChange={handleChange}
                required
                className="toolbar-input"
            />
        </div>
        <div className="col-md-6">
            <Form.Label className="fw-medium small">Especialização</Form.Label>
            <Form.Control
                type="text"
                name="especializacao"
                value={funcionario.especializacao}
                onChange={handleChange}
                required
                className="toolbar-input"
            />
        </div>
    </>
)}
```

- [ ] **Step 3: Remover o redirect para `/dentistas/editar/`**

No `handleSubmit`, substituir o bloco que redireciona para dentistas (linhas 53–59):

```js
// antes
const idDentista = response?.data?.idDentista;
if (funcionario.cargo === 'DENTISTA' && idDentista) {
    setSuccess('Funcionario dentista criado. Complete os dados clinicos (CRO e especializacao).');
    setTimeout(() => navigate(`/dentistas/editar/${idDentista}`), 1500);
} else {
    setSuccess('Funcionario e Usuario cadastrados com sucesso!');
    setTimeout(() => navigate('/funcionarios'), 1500);
}
```

por:

```js
// depois
setSuccess('Funcionario e Usuario cadastrados com sucesso!');
setTimeout(() => navigate('/funcionarios'), 1500);
```

- [ ] **Step 4: Verificar no navegador**

1. Abrir o formulário de cadastro de funcionário
2. Selecionar cargo = DENTISTA → campos CRO e Especialização devem aparecer
3. Selecionar outro cargo → campos devem desaparecer
4. Preencher todos os campos e submeter → deve navegar para `/funcionarios` sem passar por tela de dentista

- [ ] **Step 5: Commit**

```bash
git add frontend/src/Funcionario/FuncionarioCadastro.js
git commit -m "feat: campos CRO e especializacao inline no cadastro de dentista"
```
