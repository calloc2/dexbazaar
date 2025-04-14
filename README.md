# Projeto AFIM

![AFIM](https://github.com/user-attachments/assets/dffb3ff0-efc6-4455-993e-88580e5af9eb)

O AFIM é uma plataforma global para compra e venda de imóveis internacionais que:
- 🌍 Facilita negociações de imóveis para estrangeiros e investidores internacionais
- 💱 Oferece conversão automática de moedas e simulações de financiamento
- 🧭 Possui tradução automática de anúncios e suporte multilíngue
- 🏠 Conecta compradores estrangeiros com imobiliárias e construtoras locais
- 📊 Disponibiliza ferramentas de análise e suporte para aquisição de imóveis no exterior

Este documento fornece instruções para instalar e configurar o projeto AFIM em sua máquina local.

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
    git clone https://github.com/calloc2/afim.git
    cd afim
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
    - Atualize as configurações no arquivo `backend/settings.py`:
      ```python
      DATABASES = {
          'default': {
              'ENGINE': 'django.db.backends.postgresql',
              'NAME': 'afim',
              'USER': 'postgres',
              'PASSWORD': 'postgres',
              'HOST': 'localhost',
              'PORT': 5432,
          }
      }
      ```

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