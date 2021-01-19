JEKYLL_ENV=production

HOST=n4kz.com
TARGET=~/www/$(HOST)

BUNDLE=vendor/bundle

ICONS=_sass/_icons.scss
NORMALIZE=_sass/_normalize.scss

install: $(BUNDLE) $(ICONS) $(NORMALIZE)

local: install
	JEKYLL_ENV=local bundle exec jekyll serve

deploy: _site
	scp -r _site/* $(HOST):$(TARGET)

clean:
	rm -rf _site $(ICONS) $(NORMALIZE)

$(BUNDLE): Gemfile
	bundle install
	touch $@

$(ICONS): $(wildcard _icons/*.svg)
	: > $@
	@for file in $^; do \
		echo \
			"\$$icons-$$(basename $$file .svg):" \
			"url(\"data:image/svg+xml;base64,$$(openssl base64 -A < $$file)\");" >> $@; \
	done

$(NORMALIZE):
	curl -Lso $@ https://necolas.github.io/normalize.css/8.0.1/normalize.css

_site: _config.yml install
	JEKYLL_ENV=$(JEKYLL_ENV) bundle exec jekyll build

.PHONY: install local deploy clean
