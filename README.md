A web application for publishing and reading novels with support for user authentication, content management, comments, ratings, bookmarks, and automatic text translation.

## Features

* User registration and authentication
* Creating and editing novels
* Chapter management
* Automatic content translation
* Novel rating system
* Comments and comment voting
* Saving novels to a personal library
* Reading progress tracking with bookmarks
* Multilingual interface

## Technology Stack

### Backend

* NestJS
* Prisma ORM
* MongoDB
* JWT Authentication

### Frontend

* EJS
* Bootstrap
* JavaScript
* CSS

### External Services

* DeepL API

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory.

Example configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/novel_library?schema=public"

DEEPL_API_KEY="your_deepl_api_key"

JWT_SECRET="your_jwt_secret"

PORT=3000

NODE_ENV="development"
```

### Environment Variables

| Variable      | Description                    |
| ------------- | ------------------------------ |
| DATABASE_URL  | PostgreSQL connection string   |
| DEEPL_API_KEY | DeepL API key                  |
| JWT_SECRET    | Secret key used for JWT tokens |
| PORT          | Application port               |
| NODE_ENV      | Application environment        |

---

## Prisma Setup

Generate the Prisma Client:

```bash
npx prisma generate
```

Synchronize the schema with the database:

```bash
npx prisma db push
```

---

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Standard Mode

```bash
npm run start
```

### Production Mode

```bash
npm run build
npm run start:prod
```

---

## Automatic Translation

When a novel or chapter is created or updated, the system automatically generates translations using the DeepL API and stores them in the database.

When a user changes the interface language, the application serves the pre-generated translation without making additional requests to the translation service, improving performance and reducing response time.

---

## Main Functionality

### Reader

* Browse the novel library
* Search and filter novels
* Read chapters
* Change interface language
* Customize reading preferences

### Registered User

* Create and manage novels
* Add and edit chapters
* Save novels to a personal library
* Track reading progress
* Leave comments
* Rate novels and comments

### Administrator

* Manage users
* Moderate content
* Restrict publishing and commenting permissions

---

## Author

Bachelor's qualification project:

**"Development of a Web Application for an Online Library with Authentication, Content Management, and Automatic Text Translation"**
