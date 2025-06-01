# ===============================
# 📁 biogame-frontend/Makefile
# ===============================

# Configuration
PORT ?= 4100
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
	open http://localhost:$(PORT)/game.html || xdg-open http://localhost:$(PORT)/game.html || echo "Open game.html manually."

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

# Open browser to game.html
open:
	@open http://localhost:$(PORT)/game.html || xdg-open http://localhost:$(PORT)/game.html || echo "Open manually if not supported."

# Refresh
refresh:
	@make stop
	@make default
