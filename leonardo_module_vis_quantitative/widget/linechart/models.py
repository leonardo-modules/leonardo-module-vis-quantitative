
import time
import json

from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import TimeSeriesWidget

INTERPOLATION_CHOICES = (
    ('cardinal', _('Cardinal')),
    ('linear', _('Linear')),
    ('step', _('Step')),
)


class LineChartWidget(TimeSeriesWidget):
    """
    Widget which shows line chart.
    """

    interpolation = models.CharField(max_length=55, verbose_name=_(
        "Interpolation"), default='linear', choices=INTERPOLATION_CHOICES)

    class Meta:
        abstract = True
        verbose_name = _("Line chart")
        verbose_name_plural = _("Line charts")
