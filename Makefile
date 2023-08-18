install:
	npm ci

develop:
	npx webpack serve

build:
	npx webpack

lint:
	npx eslint .

tests:
	npm tests
