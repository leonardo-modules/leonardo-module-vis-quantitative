
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import NumericWidget

class TextNumberWidget(NumericWidget):
    """
    Widget which shows number in text format.
    """

    def widget_data(self, request):
        return self.get_graphite_last_value()

    class Meta:
        abstract = True
        verbose_name = _("Text Number")
        verbose_name_plural = _("Text Numbers")
