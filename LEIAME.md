# Capture o amor — Nathalie & Igor

Os convidados leem o QR code, abrem a página, escolhem ou tiram fotos e enviam.
As fotos vão para uma pasta no Google Drive, junto com uma planilha que registra o nome e a mensagem de cada envio.

```
site/index.html          → página que os convidados abrem (publicada no Netlify)
apps-script/Code.gs      → "servidor" no Google que salva as fotos no Drive
impressao/plaquinha.html → plaquinha com o QR code para imprimir (A5 ou A4)
```

## Situação atual

- **Página no ar:** https://casamento-nath-fotos.netlify.app
- **Fotos:** vão para a pasta **"Capture o amor — Nathalie & Igor"** no Google Drive **da noiva**, com o Apps Script implantado na conta dela.
- **Plaquinha:** o QR code já aponta para a página no ar.
- Testado: um envio chegou no Drive da noiva.

---

## Passo 1 — Google Apps Script (10 min)

Use a conta Google onde as fotos devem ficar guardadas. Neste projeto, a **conta da noiva**.
As fotos ficam no Drive de quem roda o `setup` e faz a implantação, não existe um e-mail para configurar.
Para outra pessoa só ver as fotos, basta compartilhar a pasta com ela no Drive.

> **Não crie a pasta no Drive na mão.** O `setup` cria a pasta e a planilha sozinho.

1. Acesse https://script.google.com e clique em **Novo projeto**.
2. Apague o conteúdo do editor e cole todo o conteúdo de `apps-script/Code.gs`. Salve com 💾.
3. Na barra de cima, escolha a função **`setup`** e clique em **▶ Executar**.
   - O Google vai pedir autorização. Clique em **Revisar permissões**, escolha a conta, depois **Avançado** e **Acessar projeto (não seguro)**, e por fim **Permitir**.
     O aviso de "não seguro" aparece porque o script é seu e não foi verificado pelo Google. Isso é normal.
   - No log aparece o link da pasta criada: **"Capture o amor — Nathalie & Igor"**.
4. Clique em **Implantar → Nova implantação**.
   - Em tipo (⚙️), escolha **App da Web**.
   - Em **Executar como**, escolha **Eu**.
   - Em **Quem pode acessar**, escolha **Qualquer pessoa**. Esse item é importante.
   - Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
5. Abra essa URL no navegador. Se aparecer `{"ok":true,...}`, está funcionando.

**Como o script sabe qual é a pasta:** o `setup` guarda o ID da pasta e da planilha em
**⚙️ Configurações do projeto → Propriedades do script** (`FOLDER_ID` e `SHEET_ID`).
Cada envio lê o `FOLDER_ID` dali. Para conferir, abra `https://drive.google.com/drive/folders/` + o `FOLDER_ID`.
Se essas propriedades estiverem vazias, rode o `setup` de novo.
Para usar outra pasta, troque o `FOLDER_ID` pelo ID dela (o código no fim do endereço da pasta).

> Se você alterar o `Code.gs` depois, vá em **Implantar → Gerenciar implantações → ✏️ → Versão: Nova versão**.
> Assim a URL continua a mesma.

## Passo 2 — Configurar a página

Abra `site/index.html` e troque a linha:

```js
const SCRIPT_URL = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
```

pela URL copiada no passo 1.

A lista do desafio, os textos e as cores também podem ser alterados no mesmo arquivo:
- textos: dentro do `<main>`
- lista do desafio: `CHALLENGES`
- cores: `:root` no começo do arquivo

## Passo 3 — Publicar a página (grátis)

**Opção mais fácil: Netlify Drop**
1. Acesse https://app.netlify.com/drop e crie uma conta grátis.
2. Arraste a pasta **`site`** para a página.
3. Você recebe um link como `https://nome-aleatorio.netlify.app`. Em *Site configuration → Change site name* dá para trocar por algo como `nathalie-e-igor.netlify.app`.
4. Para atualizar depois, vá em *Deploys* e arraste a pasta `site` de novo.
   **Toda mudança no `index.html` (inclusive na `SCRIPT_URL`) só vale depois desse novo deploy.**
   O `git push` não atualiza o site, porque ele não está ligado ao GitHub.

O site fica no ar por tempo indeterminado no plano grátis, desde que esteja numa conta Netlify.
O uso é baixo, porque as fotos vão direto do celular para o Google e não passam pelo Netlify.

**Alternativa: GitHub Pages.** Crie um repositório, envie o `index.html` e ative em *Settings → Pages*.

## Passo 4 — Plaquinha com QR code

1. Em `impressao/plaquinha.html`, coloque o link do passo 3 em `PAGE_URL` (já configurado com `https://casamento-nath-fotos.netlify.app`).
   O QR code é gerado sozinho. A lista do desafio fica em `CHALLENGES`, no mesmo arquivo.
2. Abra o arquivo no Chrome, escolha A5 ou A4 e clique em **Imprimir / Salvar PDF**.
   Use **Margens: Nenhuma** e ative **Gráficos de plano de fundo**.
3. **Teste antes de imprimir**: leia o QR com um iPhone e um Android e envie uma foto de teste de cada um.
4. Confira se as fotos de teste chegaram na pasta do Drive e apague-as (e as linhas da planilha) antes do casamento.

## Trocar a conta que recebe as fotos

1. Repita o **Passo 1** com a nova conta e copie a nova URL `/exec`.
2. Troque a `SCRIPT_URL` em `site/index.html` e publique de novo no Netlify (Passo 3, item 4).
   O link da página e o QR code continuam os mesmos.
3. Confira se o site no ar já usa a URL nova. Se o envio ainda cair no Drive antigo, faltou o deploy.
4. Na conta antiga: **Implantar → Gerenciar implantações → Arquivar** e apague a pasta antiga.

## Depois do evento (noivos)

- Abra a pasta **"Capture o amor — Nathalie & Igor"** no Google Drive.
- Os nomes dos arquivos seguem o formato `data_hora_nome-do-convidado_n.jpg`.
- A planilha **"Mensagens — Nathalie & Igor"**, na mesma pasta, lista o nome, a mensagem e o link de cada foto.
- Para baixar tudo, clique com o botão direito na pasta e escolha **Fazer download**. O Drive gera um ZIP.

## Bom saber

- As fotos são reduzidas no celular para até 2000px antes do envio, ficando com cerca de 0,5 a 1,5 MB cada. Isso deixa o envio rápido mesmo no 4G do salão e mantém qualidade de sobra para ver e imprimir em tamanho comum.
- Espaço: o Google Drive grátis tem 15 GB, o que dá para milhares de fotos.
- Quem tem o link consegue **enviar**, mas **não consegue ver** as fotos. Só a dona da conta vê a pasta.
- Para encerrar os envios depois do casamento, vá no Apps Script em **Implantar → Gerenciar implantações → Arquivar**.
