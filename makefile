install: 
	npm ci

lint:
	npx eslint .

develop:
	npx webpack serve

build:
	rm -rf public
	NODE_ENV=production npx webpack