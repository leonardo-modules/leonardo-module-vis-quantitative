
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


class LineChartWidget(TimeSeriesWidget):
    """
    Widget which shows line chart.
    """

    interpolation = models.CharField(max_length=55, verbose_name=_(
        "interpolation"), default='linear', choices=INTERPOLATION_CHOICES)

    def get_data(self):
        if self.data:
            if self.data.data_source.type == "graphite":
                return json.dumps(self.get_graphite_data())
            else:
                return None
        else: return None

    class Meta:
        abstract = True
        verbose_name = _("Line Chart")
        verbose_name_plural = _("Line Charts")
