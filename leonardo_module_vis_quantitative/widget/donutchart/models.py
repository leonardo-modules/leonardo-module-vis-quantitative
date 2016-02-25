
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import NumericWidget


class DonutChartWidget(NumericWidget):
    """
    Widget which shows donut chart.
    """

    def widget_data(self, request):
        return self.get_graphite_last_value()

    class Meta:
        abstract = True
        verbose_name = _("Donut Chart")
        verbose_name_plural = _("Donut Charts")
