from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.conf import settings

from json import loads as parse_json, load as parse_json_file, JSONDecodeError
from jsonschema import validate
from jsonschema.exceptions import ValidationError as SchemaValidationError


def validate_config(config):
    try:
        parsed = parse_json(config)
        schema = parse_json_file(open(settings.IRRIGATION_SCHEMA, "r"))
        validate(parsed, schema)
    except SchemaValidationError as e:
        raise ValidationError(e.message)
    except JSONDecodeError as e:
        raise ValidationError(e)


class PiConfig(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="configs")
    id = models.UUIDField(primary_key=True)
    config_json = models.TextField(validators=[validate_config])
