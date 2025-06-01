PORT := 4101
URL_PATH := /frontend_2026
PID_FILE := .server_pid
LOG_FILE := .server_log.txt

serve:
	@echo "Stopping server..."
	-@if [ -f $(PID_FILE) ]; then kill `cat $(PID_FILE)` 2>/dev/null || true; rm -f $(PID_FILE); fi
	@echo "Stopping logging process..."
	-@pkill -f "tail -f $(LOG_FILE)" 2>/dev/null || true
	@echo "Starting server..."
	@nohup jekyll serve --port $(PORT) --baseurl $(URL_PATH) > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE)
	@echo "Server PID: `cat $(PID_FILE)`"
	@echo "Terminal logging starting, watching server..."
	@sleep 1 && tail -f $(LOG_FILE)

stop:
	@echo "Stopping server..."
	-@if [ -f $(PID_FILE) ]; then kill `cat $(PID_FILE)` 2>/dev/null || true; rm -f $(PID_FILE); fi
	@echo "Stopping logging process..."
	-@pkill -f "tail -f $(LOG_FILE)" 2>/dev/null || true

build:
	jekyll build
