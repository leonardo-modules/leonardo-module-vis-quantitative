
from django.utils.translation import ugettext_lazy as _

from django.apps import AppConfig

from .widget import *

default_app_config = 'leonardo_module_vis_quantitative.Config'

LEONARDO_OPTGROUP = 'Quantitative Visualizations'

LEONARDO_JS_FILES = [
    'vis/js/angular_gauge_tron.js',
]

LEONARDO_SCSS_FILES = [
    'vis/scss/angular_gauge_tron.scss',
]

LEONARDO_APPS = [
    'leonardo_module_vis_quantitative',
]

LEONARDO_WIDGETS = [
    AngularGaugeWidget,
#    HorizonChartWidget,
#    LineChartWidget,
#    StackedAreaChartWidget,
]

class Config(AppConfig):

    name = 'leonardo_module_vis_quantitative'
    verbose_name = _(LEONARDO_OPTGROUP)
