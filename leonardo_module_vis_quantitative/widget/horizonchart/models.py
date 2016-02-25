
from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget


class HorizonChartWidget(TimeSeriesWidget):
    """
    Widget which shows horizon chart.
    """
    horizon_folds = models.IntegerField(
        verbose_name=_('horizon folds'), default=4)

    def widget_data(self, request):
        data = {
            'metrics': self.get_metrics(),
            'step_seconds': 60,  # int(self.get_step_delta().total_seconds),
            'low_horizon': self.low_horizon,
            'high_horizon': self.high_horizon,
            'host': self.get_host()
        }
        return data

    class Meta:
        abstract = True
        verbose_name = _("Horizon Chart")
        verbose_name_plural = _("Horizon Charts")
