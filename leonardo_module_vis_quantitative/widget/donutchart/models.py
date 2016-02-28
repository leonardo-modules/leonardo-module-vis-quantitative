
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import NumericWidget


class DonutChartWidget(NumericWidget):
    """
    Widget which shows donut chart.
    """

    class Meta:
        abstract = True
        verbose_name = _("Donut chart")
        verbose_name_plural = _("Donut charts")
