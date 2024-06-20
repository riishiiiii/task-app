OS := $(shell uname )

ifeq ($(OS), Linux)
    DC := docker compose
	RUN := docker compose up --build
	STOP := docker compose down
	BUILD := docker compose build
	PS := docker compose ps
	LOGS := docker compose logs
	RUN_MIGRATIONS := alembic upgrade head
	RUNAPP := python3 src/main.py
endif


run r:
	$(RUN)

down d:
	$(STOP)