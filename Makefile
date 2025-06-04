# Configuration
PORT ?= 4000
REPO_NAME ?= biogame-frontend
LOG_FILE = /tmp/frontend$(PORT).log

SHELL = /bin/bash -c
.SHELLFLAGS = -e

.PHONY: default server stop open

# Default target to start server

default: server
	@echo "Frontend static server started at http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) > $(LOG_FILE) 2>&1 & \
	PID=$$!; \
	echo "Server PID: $$PID"; \
	sleep 2; \
	open http://localhost:$(PORT)/frontend2/ || xdg-open http://localhost:$(PORT)/frontend2/ || echo "Open manually."

# Start static file server
server: stop
	@echo "Starting static frontend server on port $(PORT)..."
	@python3 -m http.server $(PORT) > $(LOG_FILE) 2>&1 & \
	PID=$$!; \
	echo "Server PID: $$PID"
	@until [ -f $(LOG_FILE) ]; do sleep 1; done

# Stop server and clean logs
stop:
	@echo "Stopping frontend server on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE)

open:
	@open http://localhost:$(PORT)/frontend2/ || xdg-open http://localhost:$(PORT)/frontend2/ || echo "Open manually if not supported."

# Refresh
refresh:
	@make stop
	@make default

clean:
	rm -rf _site
	rm -rf .jekyll-cache

build:
	bundle exec jekyll build