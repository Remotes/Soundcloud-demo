from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import redirect_to, direct_to_template
from django.conf import settings
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns('',
    #url(r'^$', direct_to_template, { "template" : "welcome.html"}),
    url(r'^callback/$', direct_to_template, { "template" : "soundcloud.callback.html"}),
    url(r'^$', direct_to_template, { "template" : "soundcloud.html", "extra_context" : { "debug" : getattr(settings,"DEBUG") } }),
    #url(r'^admin/', include(admin.site.urls)),
)

if getattr(settings,"DEBUG"):
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )


