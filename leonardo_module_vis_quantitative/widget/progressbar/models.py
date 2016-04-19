
from django.utils.translation import ugettext_lazy as _
from django.utils.functional import cached_property
from leonardo_module_vis_quantitative.models import NumericWidget


LAYOUT_CHOICES = (
    ('linear', _('Linear')),
    ('radial', _('Radial')),
)


class ProgressBarWidget(NumericWidget):
    """
    Widget which shows progress bar.
    """

    @cached_property
    def get_chart_params(self):

        super_data = super(NumericWidget, self).get_chart_params
        data = {
           'chartSelector': "#vis_%s svg" % self.fe_identifier
        }
        final_data = super_data.copy()
        final_data.update(data)
        return final_data

    class Meta:
        abstract = True
        verbose_name = _("Progress bar")
        verbose_name_plural = _("Progress bars")
