import datetime
import time

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

INTERPOLATION_CHOICES = (
    ('linear', _('linear')), 
    ('cardinal', _('cardinal')), 
    ('step', _('step')),
)

class LineChartWidget(TimeSeriesWidget):
    """
    Widget which shows area chart.
    """

    interpolation = models.CharField(max_length=55, verbose_name=_("interpolation"), default='linear', choices=INTERPOLATION_CHOICES)
    align_to_from = models.BooleanField(verbose_name=_('align to from'), default=False)

    def get_data(self):
        if self.data.data_source.type == "graphite":
            return self.get_graphite_data()
        else:
            return None

    def get_data_from_graphite(self):

        end = self.relative_start() + self.get_duration_delta()

        data = {
            'metrics': self.get_metrics(),
            'step_seconds': self.get_step_delta().total_seconds(),
            'step_fun': self.step_fun,
            'low_horizon': self.low_horizon,
            'high_horizon': self.high_horizon,
            'start': str(long(time.mktime(self.relative_start().timetuple()))),
            'end': str(long(time.mktime(end.timetuple()))),
            'host': self.data.get_host()
        }
        return data

    class Meta:
        abstract = True
        verbose_name = _("Line Chart")
        verbose_name_plural = _("Line Charts")
