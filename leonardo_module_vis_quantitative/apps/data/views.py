
import json
import traceback
from django.conf import settings
from django.http import HttpResponseForbidden, JsonResponse
from django.utils.decorators import method_decorator
from django.utils.functional import cached_property
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from feincms.module.mixins import StandaloneView
from feincms.views.decorators import standalone
from leonardo.module.web.widgets.utils import get_widget_from_id


class WidgetDataView(StandaloneView):

    '''This view call specific method on widget end returns JSON

    requires ``widget_id`` and optionaly ``method=get_all_data``
    which is name of method on the widget
    ``kwargs`` are propagated down to widget method

    Do not serialize data in widget methods
    '''

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(WidgetDataView, self).dispatch(request, *args, **kwargs)

    def get(self, *args, **kwargs):
        return self.post(*args, **kwargs)

    @cached_property
    def attrs(self):
        return json.loads(self.request.body)

    @method_decorator(standalone)
    def post(self, *args, **kwargs):

        # if self.request.is_ajax():
        try:
            id = self.attrs['widget_id']
        except KeyError:
            return JsonResponse({'error':
                                 'Widget_id param not found in %s.' % self.attrs})

        widget = get_widget_from_id(id)

        if not widget:
            return JsonResponse({'error': 'Widget "%s" not found' % id})

        if 'method' not in self.attrs:
            method_name = 'get_data'
        else:
            method_name = self.attrs['method']

        method = getattr(widget, method_name, None)

        if not method or not callable(method):
            return JsonResponse({'error':
                                 'The method %s is not callable'
                                 ' on %s'
                                 % (method_name, id)})

        try:

            kw = self.attrs.get('kwargs', {})
            kw.update({'request': self.request})
            data = method(**kw)

        except Exception as e:
            response = {'error': str(e)}
            if settings.DEBUG:
                response['traceback'] = traceback.format_exc()
            return JsonResponse(response)
        else:
            return JsonResponse({'data': data, 'id': id})

        return HttpResponseForbidden()
