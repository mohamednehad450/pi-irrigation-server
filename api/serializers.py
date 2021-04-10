import uuid
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import PiConfig


class PiConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiConfig
        fields = ['user', 'id', 'config_json']
        extra_kwargs = {
            'user': {
                'write_only': True
            },
        }
