
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
<<<<<<< HEAD
        "Interpolation"), default='linear', choices=INTERPOLATION_CHOICES)
    align_to_from = models.BooleanField(
        verbose_name=_('Align to from'), default=False)
=======
        "interpolation"), default='linear', choices=INTERPOLATION_CHOICES)
>>>>>>> b3ae20a6054d340ffec1106cd6a8ea2443218919

    def get_data(self):
        if self.data:
            if self.data.data_source.type == "graphite":
                return json.dumps(self.get_graphite_data())
            else:
                return None
        else: return None

    class Meta:
        abstract = True
        verbose_name = _("Line chart")
        verbose_name_plural = _("Line charts")
