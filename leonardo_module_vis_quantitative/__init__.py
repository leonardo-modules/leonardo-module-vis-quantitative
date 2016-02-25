
from django.utils.translation import ugettext_lazy as _

from django.apps import AppConfig


default_app_config = 'leonardo_module_vis_quantitative.Config'

LEONARDO_OPTGROUP = 'Quantitative Visualizations'

LEONARDO_JS_FILES = [
    'vis/js/angular_gauge_area.js',
    'vis/js/angular_gauge_pointer.js',
    'vis/js/concentric_gauge_area.js',
    'vendor/js/nvd3.js',
]

LEONARDO_SCSS_FILES = [
    'vis/scss/angular_gauge.scss',
    'vendor/css/nvd3.css',
]

LEONARDO_APPS = [
    'leonardo_module_vis_quantitative',
]

LEONARDO_WIDGETS = [
    'leonardo_module_vis_quantitative.widget.angulargauge.models.AngularGaugeWidget',
    'leonardo_module_vis_quantitative.widget.horizonchart.models.HorizonChartWidget',
    'leonardo_module_vis_quantitative.widget.linechart.models.LineChartWidget',
    'leonardo_module_vis_quantitative.widget.donutchart.models.DonutChartWidget',
]

class Config(AppConfig):

    name = 'leonardo_module_vis_quantitative'
    verbose_name = _(LEONARDO_OPTGROUP)
