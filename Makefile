test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter spec --slow 500 test/*/test-*.js

watch-test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter spec --slow 500 --watch test/test-*.js

.PHONY: test