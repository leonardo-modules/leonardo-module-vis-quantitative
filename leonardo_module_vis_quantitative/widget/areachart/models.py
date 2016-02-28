
import time
import json

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

DISPLAY_CHOICES = (
    ('stack', _('Stacked')),
    ('stream', _('Stream')),
    ('expand', _('Expanded')),
)

INTERPOLATION_CHOICES = (
    ('cardinal', _('Cardinal')),
    ('linear', _('Linear')),
    ('step', _('Step')),
)

class AreaChartWidget(TimeSeriesWidget):
    """
    Widget which shows area chart.
    """

    display = models.CharField(max_length=55, verbose_name=_(
        "Display style"), default='stack', choices=DISPLAY_CHOICES)
    interpolation = models.CharField(max_length=55, verbose_name=_(
        "Interpolation"), default='linear', choices=INTERPOLATION_CHOICES)

    class Meta:
        abstract = True
        verbose_name = _("Area chart")
        verbose_name_plural = _("Area charts")
