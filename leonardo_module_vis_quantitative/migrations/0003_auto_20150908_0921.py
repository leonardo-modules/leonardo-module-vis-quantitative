# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leonardo_module_vis_quantitative', '0002_auto_20150908_0800'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quantitativedata',
            name='metrics',
            field=models.TextField(help_text='', verbose_name='metrics'),
        ),
    ]
