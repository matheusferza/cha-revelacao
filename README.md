# 🎉 Chá Revelação Cinematográfico

Sistema web premium para **Chá Revelação**, desenvolvido para criar uma experiência emocionante e inesquecível para familiares e convidados.

A plataforma combina uma **tela pública sincronizada em tempo real**, efeitos visuais cinematográficos, contagem regressiva, painel administrativo completo e integração com Firebase, permitindo controlar toda a experiência da revelação de forma simples e profissional.

---

## ✨ Principais Recursos

### 🎈 Tela Pública

* Contagem regressiva em tempo real
* Revelação automática ou manual
* Efeitos visuais cinematográficos
* Partículas, glow e confetes animados
* Música ambiente configurável
* Exibição do nome do bebê
* Compatível com:

  * TVs
  * Telões
  * Notebooks
  * Tablets
  * Smartphones

### 📖 História do Bebê

Um espaço especial para registrar toda a jornada da gravidez.

* Capítulos personalizados
* Livro digital interativo
* Relatos emocionantes da família
* Acompanhamento da gestação

### 📸 Memórias

Linha do tempo completa da gravidez.

* Upload de fotos
* Registro de momentos especiais
* Organização cronológica
* Visual moderno e responsivo

### ❤️ Momentos Especiais

Cards personalizados para destacar acontecimentos importantes.

* Ultrassons
* Descobertas
* Consultas
* Eventos marcantes da gestação

### 💌 Recados da Família

Espaço para interação entre familiares e amigos.

* Envio de mensagens públicas
* Moderação pelo administrador
* Histórico de recados

### ⚙️ Painel Administrativo

Controle total do evento.

* Gerenciamento do cronômetro
* Controle da revelação
* Configuração do sexo do bebê
* Personalização de temas visuais
* Controle de música ambiente
* Gerenciamento de histórias, memórias e momentos
* Atualização em tempo real via Firestore

---

## 🛠️ Stack Tecnológica

### Front-end

* React
* TypeScript
* Vite
* React Router
* Framer Motion
* Lucide React

### Back-end / Cloud

* Firebase Authentication
* Firestore Database
* Firebase Hosting

### Estilização

* Tailwind CSS
* CSS Moderno
* Animações Avançadas

---

## 🗺️ Rotas do Sistema

| Rota        | Descrição                         |
| ----------- | --------------------------------- |
| `/`         | Tela pública da revelação         |
| `/historia` | Livro digital da história do bebê |
| `/momentos` | Linha de acontecimentos especiais |
| `/recados`  | Mural de mensagens da família     |
| `/memorias` | Galeria de fotos e memórias       |
| `/admin`    | Painel administrativo protegido   |

---

## 🔥 Configuração Firebase

### 1. Criar Projeto

Acesse o Firebase Console e crie um novo projeto.

### 2. Authentication

Ative:

* Email/Senha

Crie um usuário administrador.

### 3. Firestore

Ative o Firestore Database.

### 4. Regras

Publique as regras contidas em:

```bash
firestore.rules
```

### 5. Variáveis de Ambiente

Copie:

```bash
.env.example
```

para:

```bash
.env
```

e preencha com as credenciais do Firebase.

---

## 📂 Estrutura Principal do Firestore

Coleção utilizada:

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

---

## 🧪 Modo Demo

Caso o arquivo `.env` não esteja configurado, o sistema entra automaticamente em **Modo Demo**, permitindo:

* Testar a interface
* Simular a experiência da revelação
* Validar animações
* Desenvolver novas funcionalidades

Tudo isso sem necessidade de conexão com o Firebase.

---

## 🎯 Objetivo do Projeto

Criar uma experiência digital moderna, emocionante e memorável para famílias que desejam realizar um Chá Revelação diferenciado, com qualidade visual profissional, interação em tempo real e recursos capazes de transformar um momento especial em uma lembrança inesquecível.

---

## 👨‍💻 Autor

**Matheus Ferza**

Analista de Sistemas | Desenvolvedor Front-End | Criador do Projeto Chá Revelação Cinematográfico

GitHub: https://github.com/matheusferza
