from django.contrib import admin

from django.utils.translation import ugettext_lazy as _

class QuantitativeDataSource(admin.ModelAdmin):
    list_display = ['name', 'type', 'data']

admin.site.register(QuantitativeDataSource, QuantitativeDataSourceAdmin)
