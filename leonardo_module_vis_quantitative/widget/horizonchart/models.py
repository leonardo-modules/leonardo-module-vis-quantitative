
import time
import json

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

INTERPOLATION_CHOICES = (
    ('cardinal', _('cardinal')),
    ('linear', _('linear')),
    ('step', _('step')),
)

horizon_folds = models.IntegerField(verbose_name=_('horizon folds'), default=1)

class HorizonChartWidget(TimeSeriesWidget):
    """
    Widget which shows horizon chart.
    """

    def get_data(self):
        data = { 
             'endpoint': None, 
             'metrics': [] 
        }

        if self.data:
          if self.data.data_source.type == "graphite":
              data['endpoint'] = self.data.host
              data['step'] = str(self.get_step_delta().total_seconds() * 1000).rstrip("0").rstrip(".")

              for metric in self.get_metrics():
                metric_data = {
                    'target': metric['target'],
                    'name': metric['name']
                }
                data['metrics'].append(metric_data)
        
        return data 

    class Meta:
        abstract = True
        verbose_name = _("Horizon Chart")
        verbose_name_plural = _("Horizon Charts")

