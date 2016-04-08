from leonardo.module.media.models import Vector

from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import NumericWidget

class SystemChartWidget(NumericWidget):
    """
    Widget which shows number widget in system chart on vector image underlay.
    """
    background = models.ForeignKey(Vector, related_name="%(app_label)s_%(class)s_related")

    class Meta:
        abstract = True
        verbose_name = _("System chart")
        verbose_name_plural = _("System charts")
