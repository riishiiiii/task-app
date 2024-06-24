OS := $(shell uname )

ifeq ($(OS), Linux)
    DC := docker compose
	TEST := docker compose -f docker-compose-backend-test.yml up --build
	STOP := docker compose -f docker-compose-backend-test.yml down
	PS := docker compose ps
endif

test t:
	$(TEST)

stop d:
	$(STOP)test t: