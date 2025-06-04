# Configuration
PORT ?= 4000
LOG_FILE = /tmp/frontend$(PORT).log

SHELL = /bin/bash -c
.SHELLFLAGS = -e

.PHONY: default build server stop open refresh clean

# Default target to build and serve site
default: build server open

# Build the Jekyll site
build:
	@echo "Building Jekyll site..."
	@bundle exec jekyll build

# Start static server for _site folder
server: stop
	@echo "Starting static frontend server on port $(PORT)..."
	@cd _site && python3 -m http.server $(PORT) > $(LOG_FILE) 2>&1 & \
	PID=$$!; \
	echo "Server PID: $$PID"; \
	until [ -f $(LOG_FILE) ]; do sleep 1; done

# Stop any existing server
stop:
	@echo "Stopping frontend server on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE)

# Open site in browser
open:
	@open http://localhost:$(PORT)/ || xdg-open http://localhost:$(PORT)/ || echo "Open manually if not supported."

# Refresh the server
refresh:
	@make stop
	@make default

# Clean built files
clean:
	@rm -rf _site
	@rm -rf .jekyll-cache
