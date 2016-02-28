
import time
import json

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

DISPLAY_CHOICES = (
    ('stack', _('Stacked')),
    ('group', _('Grouped')),
)

class BarChartWidget(TimeSeriesWidget):
    """
    Widget for displaying time-series data using bar chart.
    """

    display = models.CharField(max_length=55, verbose_name=_(
        "Display style"), default='stacked', choices=DISPLAY_CHOICES)

    class Meta:
        abstract = True
        verbose_name = _("Bar chart")
        verbose_name_plural = _("Bar charts")
