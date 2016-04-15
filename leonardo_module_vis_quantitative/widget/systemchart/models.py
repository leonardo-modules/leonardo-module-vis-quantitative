from leonardo.module.media.models import Vector

from django.utils.translation import ugettext_lazy as _

from django.db import models

from leonardo_module_vis_quantitative.models import NumericWidget


class SystemChartWidget(NumericWidget):
    """
    Widget which shows number widget in system chart on vector image underlay.
    """
    background = models.ForeignKey(
        Vector, related_name="%(app_label)s_%(class)s_related")

    class Meta:
        abstract = True
        verbose_name = _("System chart")
        verbose_name_plural = _("System charts")

    def get_charts(self):
        metrics = self.get_metrics()
        charts = []
        for metric in metrics:
            charts.append(self.create_chart_from_metric(metric))
        return charts

    def create_chart_from_metric(self,metric):
        if 'type' in metric and metric["type"] =='gauge':
            return {
                "chart": metric["type"],
                "x":metric["x"],
                "y":metric["y"],
                "chart_config": {
                    "label": metric["name"],
                    "max": metric["horizon"],
                    "scale":metric["scale"]
                    }
                }
