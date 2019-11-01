JEKYLL_ENV=production

_site: _config.yml
	JEKYLL_ENV=$(JEKYLL_ENV) bundle exec jekyll build

local:
	JEKYLL_ENV=local bundle exec jekyll serve

deploy: _site
	scp -r _site/* n4kz@n4kz.com:~/www

clean:
	rm -rf _site

.PHONY: local deploy clean
