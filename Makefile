test:
	@NODE_ENV=test ./node_modules/.bin/mocha

watch-test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--watch

.PHONY: test watch-test