set dotenv-filename := "dev.env"

db_name := env("POSTGRES_DB")
db_user := env("POSTGRES_USER")
db_service := "db"
app_service := "app"
dev := "docker-compose.dev.yml"
prod := "docker-compose.prod.yml"

help:
    just --list

dev:
    pnpm run dev
build:
    pnpm run build
start:
    pnpm run start
lint:
    pnpm exec eslint .

migrate name="unamed":
	docker compose -f {{dev}} exec {{app_service}} npx prisma migrate dev --name {{name}}

studio:
	docker compose -f {{dev}} exec {{app_service}} npx prisma studio

reset-db:
	docker compose -f {{dev}} exec {{app_service}} npx prisma migrate reset --force

generate:
    docker compose -f {{dev}} exec {{app_service}} npx prisma generate

run-dev:
    docker compose -f {{dev}} up --build -d
run-prod:
    docker compose -f {{prod}} up --build -d
down:
    docker compose -f {{dev}} down

db-shell:
    docker compose -f {{dev}} exec {{db_service}} psql -U {{db_user}} -d {{db_name}}

db-up:
    docker compose -f {{dev}} up -d {{db_service}}

db-down:
    docker compose -f {{dev}} stop {{db_service}}
