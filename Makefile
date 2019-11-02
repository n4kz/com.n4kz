JEKYLL_ENV=production

HOST=n4kz.com
TARGET=~/www

BUNDLE=vendor/bundle

install: $(BUNDLE)

local: $(BUNDLE)
	JEKYLL_ENV=local bundle exec jekyll serve

deploy: $(BUNDLE) _site
	scp -r _site/* $(HOST):$(TARGET)

clean:
	rm -rf _site

$(BUNDLE): Gemfile.lock
	bundle install

_site: _config.yml
	JEKYLL_ENV=$(JEKYLL_ENV) bundle exec jekyll build

.PHONY: install local deploy clean
