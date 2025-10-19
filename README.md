# Menu Management API

A Node.js + TypeScript backend for menu management, built for the internship assignment.  
This application manages **Categories**, **Subcategories**, and **Items**, providing some CRUD operations and search functionality.

## Features

- Create, read, update, and search:
  - Categories: can have multiple sub categories
  - Subcategories: can have multiple items
  - Items: under either a Category or Subcategory
- Automatic `totalAmount` calculation (`baseAmount - discount`)
- Consistent JSON response format
- Prisma ORM with PostgreSQL
- Dockerized setup for local development

---

##  Getting Started

### 1️. Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2 Create a .env file
Copy and rename the example environment file:
```bash
cp dev.env.example dev.env
```
fill in values:
```.dotenv
DATABASE_URL="postgresql://user:password@db:5432/guestaradb"
PORT=3000
POSTGRES_USER=maevlava
POSTGRES_PASSWORD=guestarapassword
POSTGRES_DB=guestaradb
```

### 3 Start the application
```bash
just run-dev
```

### 4. Apply database migrations
```bash
just migrate name=init
```
To reset the database completely
```bash
just reset-db
```

### 5. Access the API
Base URL:
```bash
http://localhost:3000/api
```
example requests:
```bash
POST /api/categories
{
  "name": "Beverages",
  "image": "https://example.com/coffee.jpg",
  "description": "Drinks and refreshments",
  "taxApplicable": true,
  "taxNumber": 10,
  "taxType": "VAT"
}
```

## Design Notes
In the Item creation logic, Prisma currently doesn’t support enforcing “exactly one of these two foreign keys required” (XOR type constraint).
Reference: https://github.com/prisma/prisma/discussions/21214<br>
To handle this, I added validation at the application level:
```ts

const createItem = async (req: Request, res: Response) => {
    let item: any
    try {
        // Application-level validation to ensure item belongs
        // to either category or subcategory (not both or none)
        const validation = isUnderCategoryOrSubCategory(req.body)
        if (!validation.isValid) {
            return sendAPIError(res, validation.error!)
        }

        item = await ItemService.create(req.body)
    } catch {
        return sendAPIError(res, ItemError.CREATE_FAILED)
    }
    return sendAPIData(res, item)
}
```
## Short Questions

### 1 Which database did you choose and why?
I chose PostgreSQL because it’s stable, widely supported, and works seamlessly with Prisma’s relational modeling.
It’s perfect for hierarchical data (Category → SubCategory → Item) and easily containerized with Docker.

### 2. Three things I learned from this assignment
- Schema-driven API design: how to translate real-world menu relationships into a consistent data model while keeping the Prisma schema simple and predictable.

- Task automation with Justfile — simplifying repetitive commands like migrations, database resets, and Docker management into short, memorable aliases that improve development flow.

- Optimizing TypeScript builds with multi-stage Dockerfiles — learning how to separate the build and runtime stages to keep images lightweight and production-ready.

### 3. The most difficult part
Handling optional SubCategory relationships for Items.
Since Prisma doesn’t yet support conditional requirements between relations,
I implemented custom validation logic in the handler to ensure each Item always belongs to either a Category or a SubCategory — never both or neither.

### 4. What I would do differently given more time
- Add unit and integration tests for service and validation layers

- Implement request validation using a schema validation library (e.g., Zod or Joi)

- Deploy the API to a managed hosting platform for a live demo environment


## Loom Demo
https://www.loom.com/share/543cedc87bef42588b345d08cfb210d4?sid=44aa4589-5ed7-4da0-ae9e-8f6819949bcc
