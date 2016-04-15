
from django.utils.translation import ugettext_lazy as _

from leonardo_module_vis_quantitative.models import NumericWidget


class TextNumberWidget(NumericWidget):
    """
    Widget which shows number in text format.
    """

    class Meta:
        abstract = True
        verbose_name = _("Text number")
        verbose_name_plural = _("Text numbers")
