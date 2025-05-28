# Projeto dexBazaar

![dexbazaar](https://github.com/user-attachments/assets/bc29d4bd-e18f-4949-b29e-b0d631bfd685)


O dexBazaar é um marketplace descentralizado para compra e venda de produtos físicos com pagamento em criptomoedas.
Principais características:

- 🛒 Marketplace para qualquer categoria de produto, aberto para vendedores e compradores
- 💸 Pagamento seguro via criptomoedas, com sistema de multisig e escrow
- 🔒 Foco em privacidade e descentralização das transações
- 🛠️ Ferramentas para gestão de anúncios, carteiras e recebíveis

Este documento traz instruções para instalar e executar o projeto dexBazaar na sua máquina.

## Pré-requisitos

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

## Tecnologias Utilizadas

- **Backend**: Django, PostgreSQL, Django REST Framework
- **Frontend**: Angular, Ionic Framework
- **Containerização**: Docker, Docker Compose

### Documentação Técnica
- [Figma](https://www.figma.com/design/SjKudZhomZkMQfJH6S9mYG/ProjetoDeSistemas?node-id=0-1&p=f)
- [Canvas e MVP](https://docs.google.com/document/d/1_lcApBw3zV5uPu6YecKle387iv3_uuYzAaiRIxjvHJc/edit?usp=sharing)
