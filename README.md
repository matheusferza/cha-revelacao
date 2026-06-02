# 🎉 Chá Revelação Cinematográfico

Sistema web premium para chá revelação com tela pública sincronizada em tempo real, painel administrativo protegido por Firebase Auth, cronômetro, revelação manual, partículas, confetes, glow, áudio ambiente e suporte a TV/telão.

## Stack

- React + TypeScript + Vite
- TailwindCSS
- Framer Motion
- React Router
- Firebase Authentication
- Firestore Database
- Firebase Hosting

## Rotas

- `/` - Tela pública para TV, telão, notebook ou celular.
- `/historia` - Blog/portfólio afetivo do bebê para família e amigos acompanharem de longe.
- `/momentos` - Ultrassons, descobertas e caminhada até a paternidade.
- `/recados` - Mural para família deixar recados em texto.
- `/memorias` - Linha do tempo com fotos e textos da gravidez até o nascimento.
- `/admin` - Painel administrativo com login e controles ao vivo.

## Firebase

1. Crie um projeto no Firebase.
2. Ative Authentication com provedor Email/Senha.
3. Crie um usuário administrador.
4. Ative Firestore Database.
5. Publique as regras de `firestore.rules`.
6. Copie `.env.example` para `.env` e preencha as credenciais do app web.

Coleção usada:

```txt
reveal_settings/main
```

Campos principais:

```txt
gender
babyName
storyTitle
storyIntro
currentWeek
nextMilestone
familyMessage
revealDate
countdownEnabled
revealed
musicEnabled
theme
createdAt
updatedAt
```

---

## 🚀 Desenvolvimento

Instalar dependências:

```bash
npm install
```

Executar ambiente local:

```bash
npm run dev
```

---

## 📦 Build de Produção

```bash
npm run lint
npm run build
```

---

## ☁️ Deploy Firebase Hosting

```bash
npm run build
firebase deploy
```

Sem `.env`, o app entra em modo demo local para permitir testar a experiência visual antes da configuração Firebase.
