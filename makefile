#makefile for easy handling of regular tasks in the project
#1. clean the project from intermediate files like node_modules or documentation
#2. to easily test everything locally what can be testes by travis

#directories
INTERMEDIATE = node_modules
DOCUMENTATION = ./jsdoc
WEB = ./www
TESTS = ./tests
HTML = $(WEB)/html/
CSS = $(WEB)/css/
JAVASCRIPT = $(WEB)/js/

.PHONY: list cleanall cleandoc init doc teststyle testhtmlstyle testjsstyle testjstestsstyle testcssstyle

list:
	@echo possible targets:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs

cleanall:
	@make cleanlib
	@make cleandoc

cleanlib:
	@echo remove libraries:
	@rm -Rf $(INTERMEDIATE)

cleandoc:
	@echo remove documentation:
	@rm -Rf $(DOCUMENTATION)

init:
	@echo installing libraries:
	@npm install

doc:
	@make init
	@echo installing node modules:
	@./node_modules/.bin/jsdoc -d $(DOCUMENTATION) $(WEB)/**/*.js

teststyle:
	@make testhtmlstyle
	@make testjsstyle
	@make testjstestsstyle
	@make testcssstyle

testhtmlstyle:
	@make init
	@echo linting html:
	@./node_modules/.bin/htmllint $(WEB)/**/*.html
testjsstyle:
	@make init
	@echo linting js:
	@./node_modules/.bin/eslint $(WEB)/**/*.js
testjstestsstyle:
	@make init
	@echo linting js unit tests:
	@./node_modules/.bin/eslint $(TESTS)/**/*.js
testcssstyle:
	@make init
	@echo linting css:
	@./node_modules/.bin/stylelint $(WEB)/**/*.css

testunits:
	@make init
	@echo unit testing:
	@npm test
