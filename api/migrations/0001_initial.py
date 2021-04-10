# Generated by Django 3.0.8 on 2021-04-10 13:38

import api.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PiConfig',
            fields=[
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('config_json', models.TextField(validators=[api.models.validate_config])),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
