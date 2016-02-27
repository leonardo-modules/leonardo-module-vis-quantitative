
import time
import json

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

DISPLAY_CHOICES = (
    ('stacked', _('Stacked')),
    ('stream', _('Stream')),
    ('expanded', _('Expanded')),
)

INTERPOLATION_CHOICES = (
    ('cardinal', _('cardinal')),
    ('linear', _('linear')),
    ('step', _('step')),
)

class AreaChartWidget(TimeSeriesWidget):
    """
    Widget which shows area chart.
    """

    display = models.CharField(max_length=55, verbose_name=_(
        "Display"), default='stacked', choices=DISPLAY_CHOICES)
    interpolation = models.CharField(max_length=55, verbose_name=_(
        "Interpolation"), default='linear', choices=INTERPOLATION_CHOICES)
    align_to_from = models.BooleanField(
        verbose_name=_('align to from'), default=False)

    def get_data(self):
        if self.data.data_source.type == "graphite":
            return json.dumps(self.get_graphite_data())
        else:
            return None

    class Meta:
        abstract = True
        verbose_name = _("Area Chart")
        verbose_name_plural = _("Area Charts")
