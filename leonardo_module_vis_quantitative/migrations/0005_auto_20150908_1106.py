# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leonardo_module_vis_quantitative', '0004_auto_20150908_0921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quantitativedata',
            name='metrics',
            field=models.TextField(help_text='', verbose_name='metrics'),
        ),
        migrations.AlterField(
            model_name='quantitativedatasource',
            name='type',
            field=models.CharField(default=b'graphite', max_length=255, verbose_name='type', choices=[(b'dummy', 'Test data'), (b'graphite', 'Graphite'), (b'influxdb', 'InfluxDB'), (b'opentsdb', 'OpenTSDB')]),
        ),
    ]
