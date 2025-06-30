# Projeto dexBazaar

![dexbazaar](https://github.com/user-attachments/assets/bc29d4bd-e18f-4949-b29e-b0d631bfd685)

## 📝 Sobre o Projeto

O dexBazaar é um marketplace descentralizado para compra e venda de produtos físicos com pagamento em criptomoedas.

### 🎯 MVP (Minimum Viable Product)

O MVP do dexBazaar foi desenvolvido com foco nas funcionalidades essenciais para validar a proposta de valor:

#### ✅ Funcionalidades Implementadas
- **👤 Sistema de Usuários**
  - Registro e autenticação de usuários
  - Perfis personalizados com foto e informações
  - Sistema de reputação com avaliações (estrelas)

- **🛒 Marketplace**
  - Listagem de produtos por categorias
  - Sistema de busca e filtros avançados
  - Upload de imagens para produtos
  - Gestão completa de anúncios (criar, editar, deletar)

- **💰 Sistema de Preços**
  - Preços em Reais (BRL) 
  - Conversão automática para Ethereum (ETH)
  - Cotação em tempo real via API CoinGecko

- **🎨 Interface Moderna**
  - Design responsivo (mobile-first)
  - Dark mode otimizado
  - Animações e transições suaves
  - Loading states e feedback visual

- **🔧 Funcionalidades Técnicas**
  - API REST robusta com Django
  - Frontend reativo com Angular + Ionic
  - Banco de dados PostgreSQL
  - Sistema de imagens e media files

#### 🚀 Próximas Funcionalidades (Roadmap)
- **💸 Pagamentos em Cripto**
  - Integração com carteiras Web3
  - Sistema de escrow e multisig
  - Suporte a múltiplas criptomoedas

- **🔒 Segurança Avançada**
  - Verificação KYC opcional
  - Sistema de disputas
  - Histórico de transações

- **📱 Features Adicionais**
  - Chat entre usuários
  - Notificações push
  - Sistema de favoritos
  - Avaliações de produtos

### 🌟 Principais Características

- 🛒 **Marketplace Aberto**: Para qualquer categoria de produto, aberto para vendedores e compradores
- 💸 **Pagamentos Crypto**: Sistema seguro via criptomoedas, com escrow planejado
- 🔒 **Privacidade**: Foco em privacidade e descentralização das transações
- 🛠️ **Gestão Completa**: Ferramentas para gestão de anúncios, perfis e reputação
- 📱 **Mobile First**: Interface otimizada para dispositivos móveis
- 🌙 **Dark Mode**: Design moderno com tema escuro nativo

## 🔧 Funcionalidades Detalhadas

### 🔍 Sistema de Busca
- **Busca em tempo real** com debounce
- **Filtros por categoria** com chips interativos
- **Combinação de filtros** (busca + categoria)
- **Resultados dinâmicos** sem reload da página

### 👥 Sistema de Usuários
- **Registro** com validação de campos
- **Login** com remember me
- **Perfis** com foto e informações
- **Reputação** baseada em avaliações

### 🛒 Gestão de Produtos
- **CRUD completo** (criar, ler, atualizar, deletar)
- **Upload de múltiplas imagens**
- **Categorização automática**
- **Preços em BRL** com conversão para ETH

### 💫 UX/UI Features
- **Dark mode** nativo e otimizado
- **Animações** suaves em CSS
- **Loading states** com spinners
- **Toast notifications** para feedback
- **Empty states** informativos
- **Responsive design** mobile-first

## 🛠️ Tecnologias e Arquitetura

Certifique-se de ter os seguintes itens instalados:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Python 3.8+](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)

## Passo a passo para instalação

1. **Clone o repositório**
    ```bash
        git clone https://github.com/calloc2/dexbazaar.git
        cd dexbazaar
    ```

## Como Executar

### 1. Backend (Django)
- Instale o Python, o DockerCompose e o gerenciador de pacotes `pip` (caso ainda não tenha):
    ```bash
    sudo apt update
    sudo apt install python3 python3-pip
    sudo apt install docker-compose
    ```

- Crie e ative o ambiente virtual (obrigatório para rodar o backend):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    ```

2. **Instale as dependências do backend:**
    ```bash
    pip install -r requirements.txt
    ```

3. **Configure o banco de dados PostgreSQL:**
    - Crie um banco de dados no PostgreSQL:
      ```sql
      CREATE DATABASE afim;
      CREATE USER postgres WITH PASSWORD 'postgres';
      GRANT ALL PRIVILEGES ON DATABASE afim TO postgres;
      ```
    - Crie um arquivo .env na pasta raíz do projeto com as credenciais do banco de dados, arquivo de exemplo: `env.example`:
      ```bash
            DB_ENGINE=django.db.backends.postgresql
            DB_NAME=afim
            DB_USER=postgres
            DB_PASSWORD=postgres
            DB_HOST=localhost
            DB_PORT=5432
      ```
    - Rode o script em backend/scripts/populate_categories.py no shell do django, para popular sua DB com as categorias.

4. **Aplique as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```

5. **Crie um superusuário (opcional):**
    ```bash
    python manage.py createsuperuser
    ```

6. **Inicie o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver
    ```

O backend estará disponível em: [http://localhost:8000](http://localhost:8000).

### 2. Frontend (Angular + Ionic)
- Instale as dependências:
    ```bash
    cd frontend
    npm install
    ```
- Inicie o servidor de desenvolvimento:
    ```bash
    ionic serve
    ```
- O frontend estará disponível em: [http://localhost:8100](http://localhost:8100).

## Comunicação entre Frontend e Backend

O frontend se comunica com o backend via API REST configurada no arquivo `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
```

## 🛠️ Tecnologias e Arquitetura

### 🔙 Backend
- **Framework**: Django 4.x + Django REST Framework
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Token-based authentication
- **Media**: Sistema de upload de imagens
- **API**: RESTful com serializers

### 🔙 Frontend
- **Framework**: Angular 17+ 
- **UI Library**: Ionic 7+
- **Linguagem**: TypeScript
- **Styling**: SCSS com CSS Custom Properties
- **State Management**: Services + RxJS
- **Build**: Angular CLI + Vite

### 🔧 DevOps & Tools
- **Containerização**: Docker + Docker Compose
- **Versionamento**: Git
- **Package Manager**: npm/yarn + pip
- **Linting**: ESLint + Prettier
- **Bundle**: Webpack (via Angular CLI)

### 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │   ────────────→  │                 │
│   Angular App   │                  │  Django API     │
│   (Port 8100)   │   ←────────────  │  (Port 8000)    │
│                 │    JSON Data     │                 │
└─────────────────┘                  └─────────────────┘
         │                                     │
         │ Ionic UI                           │ ORM
         │ Components                         │ Models
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   User Device   │                  │   PostgreSQL    │
│   (Browser)     │                  │   Database      │
└─────────────────┘                  └─────────────────┘
```

## 🌐 APIs Externas

- **CoinGecko API**: Cotação de criptomoedas em tempo real
- **Ionicons**: Biblioteca de ícones
- **Angular Material**: Componentes UI (planejado)

## 📋 Pré-requisitos

## 🚀 Scripts Úteis

### 📦 Instalação Rápida
```bash
# Clone o projeto
git clone https://github.com/calloc2/dexbazaar.git
cd dexbazaar

# Backend setup
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup (nova aba do terminal)
cd frontend
npm install
ionic serve
```

### 🐳 Docker (Alternativa)
```bash
# Build e execute com Docker Compose
docker-compose up --build

# Apenas execute (após primeiro build)
docker-compose up
```

### 🔧 Comandos de Desenvolvimento
```bash
# Backend - Django
python manage.py makemigrations    # Criar migrações
python manage.py migrate          # Aplicar migrações
python manage.py createsuperuser  # Criar admin
python manage.py shell           # Shell interativo
python manage.py collectstatic   # Coletar arquivos estáticos

# Frontend - Angular/Ionic
ionic serve                       # Servidor de desenvolvimento
ionic build                      # Build para produção
ng generate component <name>     # Gerar componente
ng generate service <name>       # Gerar serviço
ionic capacitor run ios          # Run no iOS
ionic capacitor run android      # Run no Android
```

### 📊 Populando Dados de Teste
```bash
# Executar no shell do Django
python manage.py shell

# Dentro do shell:
exec(open('backend/scripts/populate_categories.py').read())
```

## 🌍 Configuração de Environment

### 🔙 Backend (.env)
```env
# Banco de dados
DB_ENGINE=django.db.backends.postgresql
DB_NAME=afim
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Media files
MEDIA_URL=/media/
MEDIA_ROOT=media/
```

### 🔙 Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  coinGeckoApi: 'https://api.coingecko.com/api/v3'
};
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Clone** seu fork: `git clone <your-fork-url>`
3. **Branch** para feature: `git checkout -b feature/amazing-feature`
4. **Commit** suas mudanças: `git commit -m 'Add amazing feature'`
5. **Push** para branch: `git push origin feature/amazing-feature`
6. **Pull Request** para o repositório principal

### 📝 Convenções de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, sem mudança de código
refactor: refatoração de código
test: adição ou correção de testes
chore: tarefas de build, configs, etc
```

## 🐛 Troubleshooting

### ❌ Problemas Comuns

**Backend não inicia:**
```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Ativar ambiente virtual
source venv/bin/activate

# Verificar dependências
pip install -r requirements.txt
```

**Frontend não compila:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version  # Deve ser 16+
```

**Erro de CORS:**
```python
# settings.py - Adicionar ao CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8100",
    "http://127.0.0.1:8100",
]
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe dexBazaar
- **Design**: Conforme Figma disponível
- **Backend**: Django REST Framework
- **Frontend**: Angular + Ionic

## 📞 Contato

- **GitHub**: [@calloc2](https://github.com/calloc2)
- **Projeto**: [dexBazaar Repository](https://github.com/calloc2/dexbazaar)

---

### 📚 Documentação Técnica
---

### 📚 Documentação Técnica e Links Úteis

- 🎨 **[Figma Design](https://www.figma.com/design/SjKudZhomZkMQfJH6S9mYG/ProjetoDeSistemas?node-id=0-1&p=f)** - Protótipos e design system
- 📋 **[Canvas e MVP](https://docs.google.com/document/d/1_lcApBw3zV5uPu6YecKle387iv3_uuYzAaiRIxjvHJc/edit?usp=sharing)** - Documento de planejamento
- 🚀 **[GitHub Repository](https://github.com/calloc2/dexbazaar)** - Código fonte
- 📊 **[API Documentation](http://localhost:8000/api/)** - Documentação da API (quando rodando)
- 🌐 **[Frontend Demo](http://localhost:8100)** - Interface web (quando rodando)

---

## 🎯 Status do Projeto

**Versão Atual**: v1.0.0 (MVP)  
**Status**: ✅ Em Desenvolvimento Ativo  
**Última Atualização**: Junho 2025

### 📈 Métricas do MVP
- ✅ **Funcionalidades Core**: 100% implementadas
- ✅ **UI/UX**: Dark mode responsivo
- ✅ **Backend API**: REST completa
- ✅ **Frontend**: Angular + Ionic otimizado
- 🔄 **Pagamentos Crypto**: Em desenvolvimento
- 🔄 **Testes**: Em implementação

**🏆 MVP Completo e Funcional! Pronto para demonstrações e validação de mercado.**
