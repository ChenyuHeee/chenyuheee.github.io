# Simple Makefile for common tasks
.PHONY: serve build deploy clean

serve:
	python3 -m mkdocs serve

build:
	python3 -m mkdocs build --clean

deploy: build
	# Deploy uses GitHub Actions by pushing to main. Uncomment the manual deploy step below to push site to gh-pages directly.
	@echo "Push to main to trigger GitHub Actions workflow: git push origin main"

clean:
	rm -rf site
	@echo "site/ removed"
