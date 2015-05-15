import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quatitative.models import TimeSeriesWidget

class AngularGaugeWidget(TimeSeriesWidget):
    """
    Widget which shows angular gauge.
    """
    major_ticks = models.IntegerField(verbose_name=_('major ticks'), default=5)
    minor_ticks = models.IntegerField(verbose_name=_('minor ticks'), default=2)
    threshold_warning = models.IntegerField(verbose_name=_('warning threshold'), default=70)
    threshold_critical = models.IntegerField(verbose_name=_('critical threshold'), default=90)

    def widget_data(self, request):
        return self.get_graphite_last_value()

    class Meta:
        abstract = True
        verbose_name = _("Angular gauge")
        verbose_name_plural = _("Angular gauges")
