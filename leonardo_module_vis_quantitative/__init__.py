
import logging

from django.apps import AppConfig

LOG = logging.getLogger(__name__)

#from .widget import *

default_app_config = 'leonardo_module_vis_quantitative.NavConfig'


class Default(object):

    optgroup = ('Quantitatve vis')

    @property
    def apps(self):

        return [

            'leonardo_module_vis_quantitative',

        ]

    @property
    def widgets(self):
        return [
#            HorizonChartWidget,
#            LineChartWidget,
        ]

class NavConfig(AppConfig, Default):

    name = 'leonardo_module_vis_quantitative'
    verbose_name = "Quantitative Visualization Module"


default = Default()
