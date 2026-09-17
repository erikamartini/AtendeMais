# AtendeMais — Documentação para Aprendizes

## Resumo rápido
AtendeMais é um protótipo simples para gerenciar chamados entre duas contas de demonstração: Cliente e Atendente. Foi criado para resolver um problema real de atendimento: pedidos e dúvidas espalhados, sem histórico organizado.

## O problema que resolvemos (atendimento)
- Mensagens e pedidos que se perdem em chats ou e-mails.
- Respostas repetidas gastando tempo dos atendentes.
- Falta de um fluxo simples e testável para validar soluções pequenas.

Resultado esperado: reduzir confusão, centralizar solicitações e permitir respostas mais rápidas e reutilizáveis.

## Funcionalidades principais (o que o protótipo faz)
- Criar um chamado com título e descrição.
- Listar chamados abertos e fechados na tela principal.
- Excluir chamados (quando resolvidos) com atualização imediata da lista.
- Base de conhecimento: lista de artigos e navegação para abrir cada artigo.
- Contas de demonstração reduzidas a duas: Cliente e Atendente (facilita testes e controle).

## Tecnologias usadas (versão simples, fácil de entender)
- Frontend: React (biblioteca para construir interfaces) — arquivos em `src/`.
- Ferramenta de construção: Vite (serve e empacota o site para produção).
- Deploy: pensado para Netlify ou Vercel (serviços que hospedam sites estáticos).
- Ajustes para compatibilidade entre Windows e servidores Linux: `.gitattributes` e mudanças em `package.json` para evitar erros de permissão no CI.

Arquivos importantes:
- `src/main.jsx` — código principal do protótipo (interface, criação/exclusão de chamados, navegação).
- `src/styles.css` — estilos e regras de responsividade para celular.
- `package.json` — scripts para instalar, rodar e construir o projeto.

## Como o protótipo funciona (explicação sem termos técnicos)
- O site roda no navegador. Tudo acontece no próprio navegador — durante a demo.
- Quando um usuário cria um chamado, ele aparece na lista imediatamente — sem precisar atualizar a página.
- A base de conhecimento tem títulos de artigos; clicar em um título abre o artigo correspondente.
- Para testar, usamos duas contas prontas: `Cliente` cria chamados; `Atendente` visualiza e exclui quando resolvido.

> Observação: atualmente os dados não são salvos em um banco de dados — ao recarregar a página, a lista volta ao estado inicial. Isso é normal no protótipo e a próxima etapa é adicionar persistência.

## Como executar o projeto (passo a passo simples)
1. Abra a pasta do projeto no terminal.
2. Instale as dependências (uma vez):

```bash
npm ci
```

3. Rodar em modo desenvolvimento (para mostrar no PC ou no celular pela rede):

```bash
npm run dev -- --host 0.0.0.0
```

- O terminal vai mostrar um endereço, por exemplo `http://192.168.0.10:5173` — abra esse endereço no navegador do PC.
- Para acessar do celular, conecte o celular à mesma rede Wi‑Fi e abra o mesmo endereço.

4. Fazer uma build para produção (opcional):

```bash
npm run build
```

- Os arquivos finais ficam na pasta `dist` e podem ser publicados no Netlify/Vercel.

## Roteiro de demonstração (simples, 5 minutos)
1. Apresente rapidamente o problema que queremos resolver (30s).
2. Entre como `Cliente` e crie um chamado (30s).
3. Troque para `Atendente`, veja o chamado e exclua-o (1 min).
4. Abra um artigo da base de conhecimento e mostre o conteúdo (30s).
5. Mostre a versão no celular (se possível) para provar que o layout foi ajustado (1 min).
6. Conclusão e próximos passos (30s).

## Testes no celular (o que verificar)
- Layout: o menu e os botões cabem na tela sem rolagem horizontal.
- Criar/excluir: criar um chamado e verificar se some quando excluído.
- Base de conhecimento: clicar em um artigo abre o conteúdo correto.

Se algo não funcionar, anote o que aconteceu e envie um print ou o log do terminal.

## Problemas que já resolvemos (em linguagem simples)
- Erro em provedores de deploy (Netlify/Vercel) causado por execução de binários com permissões incorretas. Solução aplicada: ajustar scripts e adicionar `.gitattributes` para normalizar arquivos.
- Layout quebrado em celular — ajustamos `src/styles.css` para empilhar elementos, dar largura total a CTAs e impedir rolagem horizontal.
- Redução das contas demo para apenas duas para facilitar testes.

## Próximos passos recomendados (fáceis para aprendizes)
- Redeploy público: peça ao responsável para forçar um redeploy sem cache no Netlify/Vercel e depois teste o site no celular.
- Adicionar persistência simples: criar um backend pequeno (Node + SQLite) para salvar chamados.
- Fazer um mini‑vídeo de 2 minutos mostrando a demo.
- Escrever 3 testes manuais para validar criação, exclusão e navegação de artigos.

## Como relatar um problema (modelo rápido)
- O que você fez: (ex.: "Entrei como Cliente e criei chamado X").
- O que aconteceu: (ex.: "O botão não apareceu" ou "Nada acontece quando clico em excluir").
- O que espera: (ex.: "O chamado deve desaparecer da lista").
- Anexe: print da tela e, se possível, o log do terminal onde rodou `npm run dev`.

## Contato e recursos
- Repositório: https://github.com/erikamartini/AtendeMais
- Posso ajudar com: gerar PDF/PPT, disparar redeploy (guiado) e interpretar logs.

---

Se quiser, eu já gero um arquivo PDF ou PPT com esta documentação e um resumo em 3 slides para a apresentação curta. Quer que eu gere o PDF/PPT agora?