# -*- coding:/ utf-8 -*-

import datetime
from math import floor
from time import time
import json

import requests
from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _
from leonardo.module.web.models import Widget
from yamlfield.fields import YAMLField
from random import randint


SOURCE_TYPES = (
    ('dummy', _('Test data')),
    ('graphite', _('Graphite')),
    ('influxdb', _('InfluxDB')),
    ('opentsdb', _('OpenTSDB')),
)

TIME_UNITS = (
    ('second', _('seconds')),
    ('minute', _('minutes')),
    ('hour', _('hours')),
    ('day', _('days')),
)

STEP_FUNS = (
    ('sum', _('sum')),
    ('avg', _('average')),
    ('min', _('minimum')),
    ('max', _('maximum')),
)


@python_2_unicode_compatible
class QuantitativeDataSource(models.Model):
    type = models.CharField(max_length=255, verbose_name=_(
        "type"), default='graphite', choices=SOURCE_TYPES)
    name = models.CharField(max_length=255, verbose_name=_("name"))
    data = YAMLField(verbose_name=_("data"), help_text=_(
        'For graphite set: host, port, ssl, user, passwd'))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Quantitative data source")
        verbose_name_plural = _("Quantitative data sources")


@python_2_unicode_compatible
class QuantitativeData(models.Model):
    data_source = models.ForeignKey(
        QuantitativeDataSource, verbose_name=_('data source'))
    metrics = models.TextField(verbose_name=_("metrics"))

    def __str__(self):
        metrics = (self.metrics[:80] + '..') if len(self.metrics) > 80 else self.metrics
        return "%s: %s" % (self.data_source.name, metrics)

    class Meta:
        verbose_name = _("Quantitative data")
        verbose_name_plural = _("Quantitative data")

    @cached_property
    def host(self):
        return self.get_host()

    def get_host(self):
        if self.data_source.type == 'graphite':
            if self.data_source.data.get('ssl', False):
                protocol = 'https'
            else:
                protocol = 'http'
            return '%s://%s:%s' % (protocol, self.data_source.data['host'], self.data_source.data['port'])


class TemporalDataWidget(Widget):

    data = models.ForeignKey(QuantitativeData, verbose_name=_(
        'graph'), blank=True, null=True)
    step_length = models.IntegerField(verbose_name=_('step length'), default=1)
    step_unit = models.CharField(max_length=55, verbose_name=_(
        'step unit'), choices=TIME_UNITS, default="minute")
    step_fun = models.CharField(max_length=55, verbose_name=_(
        'step function'), choices=STEP_FUNS, default="avg")
    start = models.DateTimeField(verbose_name=_(
        'start time'), blank=True, null=True)
    align_to_from = models.BooleanField(
        verbose_name=_('Align to from'), default=False)

    def relative_start(self):
        if self.start:
            return self.start
        else:
            now = datetime.datetime.now()
            return now - self.get_duration_delta()

    def get_step_delta(self):
        delta = None
        if self.step_unit == 'day':
            delta = datetime.timedelta(days=self.step_length)
        if self.step_unit == 'hour':
            delta = datetime.timedelta(hours=self.step_length)
        if self.step_unit == 'minute':
            delta = datetime.timedelta(minutes=self.step_length)
        if self.step_unit == 'second':
            delta = datetime.timedelta(seconds=self.step_length)
        return delta

    def get_step_label(self):
        if self.step_unit == 'day':
            return 'd'
        if self.step_unit == 'hour':
            return 'h'
        if self.step_unit == 'minute':
            return 'm'
        if self.step_unit == 'second':
            return 's'
        return '?'

    def get_graphite_data(self, **kwargs):
        url = "%s/render" % self.data.get_host()
        duration_delta = self.get_duration_delta().total_seconds()
        data = []

        for metric in self.get_metrics():
            target = 'summarize({}, "{}s", "{}")'.format(metric["target"], str(
                self.get_step_delta().total_seconds()).rstrip('0').rstrip('.'), self.step_fun)
            start = str(floor(
                time() - self.get_duration_delta().total_seconds())).rstrip('0').rstrip('.')
            params = {
                "format": "json",
                "from": start,
                "target": target,
            }

            request = requests.get(url, params=params)
            json_dict = json.loads(request.text)
            values = []
            for item in json_dict[0]['datapoints']:
                values.append({
                    'x': item[1],
                    'y': item[0],
                })
            datum = {
                'key': metric['name'],
                'values': values
            }
            data.append(datum)

        return data

    def get_graphite_datum(self, **kwargs):
        url = "%s/render" % self.data.get_host()
        duration_delta = self.get_step_delta().total_seconds()
        data = []

        for metric in self.get_metrics():
            target = 'summarize({}, "{}s", "{}")'.format(metric["target"], str(
                self.get_step_delta().total_seconds()).rstrip('0').rstrip('.'), self.step_fun)
            start = str(floor(
                time() - self.get_step_delta().total_seconds())).rstrip('0').rstrip('.')
            params = {
                "format": "json",
                "from": start,
                "target": target,
            }

            request = requests.get(url, params=params)
            json_dict = json.loads(request.text)
            item_dict = {}
            for i, item in enumerate(json_dict):
                json_not_none = [ x for x in item['datapoints'] if None not in x ]
                if len(json_not_none) == 0:
                # I expect this to be caused by very short step, try with longer step
                # TODO: actually get the step and set second try step larger
                    if not item_dict:
                        start = str(floor(time() - datetime.timedelta(minutes=5).total_seconds())).rstrip('0').rstrip('.')
                        params['from'] = start
                        wide_request = requests.get(url, params=params)
                        values_dict = json.loads(wide_request.text)
                        item_dict = values_dict
                    not_none = [ x for x in item_dict[i]['datapoints'] if None not in x ]
                    value = 0
                    if len(not_none) > 0:
                        value = not_none[-1][0]
                    datum = {
                        'label': metric['name'],
                        'value': value
                    }
                    data.append(datum)
                else:
                    value = json_not_none[-1][0]
                    datum = {
                        'label': metric['name'],
                        'value': value
                    }
                    data.append(datum)

        return data

    def get_metrics(self):
        metrics = self.data.metrics.split("\n")
        ret = []
        for metric in metrics:
            if metric.strip('\n').strip('\r') != '':
                line = metric.strip('\n').strip('\r').split('|')
                final_line = {
                    'target': line[0],
                    'unit': line[1],
                    'name': line[2]
                }
                if len(line) > 5:
                    final_line['type'] = line[3]
                    final_line['x'] = line[4]
                    final_line['y'] = line[5]
                ret.append(final_line)
        return ret

    def get_data(self, request, **kwargs):
        '''Returns all widget data in array or dictionary
        method must accepts ``kwargs`` where the request is
        and other kwargs which are used for advance cases
        '''
        return self.get_graph_data()

    def get_update_data(self, request, **kwargs):
        '''Returns part of widget data in array or dictionary
        method must accepts ``kwargs`` where the request is
        and other kwargs which are used for advance cases
        such as filtering etc.

        You can make your custom method which will be available
        for calling from fronted side and this is just an example
        how to achieve that
        '''
        return self.get_graph_data()

    auto_reload = True

    class Meta:
        abstract = True


class TimeSeriesWidget(TemporalDataWidget):
    """
    Time-series widget mixin.
    """
    duration_length = models.IntegerField(
        verbose_name=_('duration length'), default=2)
    duration_unit = models.CharField(max_length=55, verbose_name=_(
        'duration unit'), choices=TIME_UNITS, default="hour")
    low_horizon = models.IntegerField(
        verbose_name=_('low horizon'), blank=True, null=True)
    high_horizon = models.IntegerField(
        verbose_name=_('high horizon'), blank=True, null=True)

    @cached_property
    def source(self):
        return self.data.data_source

    def get_duration_delta(self):
        delta = None
        if self.duration_unit == 'day':
            delta = datetime.timedelta(days=self.duration_length)
        if self.duration_unit == 'hour':
            delta = datetime.timedelta(hours=self.duration_length)
        if self.duration_unit == 'minute':
            delta = datetime.timedelta(minutes=self.duration_length)
        if self.duration_unit == 'second':
            delta = datetime.timedelta(seconds=self.duration_length)
        return delta

    def get_graph_data(self):
        if self.data is not None:
            if self.data.data_source.type == "graphite":
                return self.get_graphite_data()
            else:
                return None
        else:
            return None

    class Meta:
        abstract = True


class NumericWidget(TemporalDataWidget):
    """
    NumericValue widget mixin.
    """

    def get_graph_data(self):
        if self.data.data_source.type == "graphite":
            return json.dumps(self.get_graphite_datum())
        else:
            return None

    @cached_property
    def source(self):
        return self.data.data_source

    class Meta:
        abstract = True
