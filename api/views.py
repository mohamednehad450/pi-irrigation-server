import os

from django.shortcuts import render, HttpResponse, get_object_or_404
from django.conf import settings
from django.core.exceptions import ValidationError

from rest_framework import permissions, viewsets
from rest_framework.response import Response

from .models import PiConfig
from .serializers import PiConfigSerializer


def frontend(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        logging.exception('Production build of app not found')
        return HttpResponse(
            """
            This URL is only used when you have built the production
            version of the app. Visit http://localhost:3000/ instead, or
            run `yarn run build` to test the production version.
            """,
            status=501,
        )


class PiConfigViewSet(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PiConfig.objects.filter(user=user).all()

    def list(self, request):
        serializer = PiConfigSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            config = get_object_or_404(PiConfig, user=request.user, pk=pk)
            return Response(PiConfigSerializer(config).data)
        except ValidationError:
            return Response({"id": [f"'{pk}' is not a valid UUID ID"]}, status=400)

    def create(self, request):
        ser = PiConfigSerializer(
            data={**request.data, "user": request.user.id})
        if ser.is_valid():
            config = ser.save()
            return Response(PiConfigSerializer(config).data)
        else:
            return Response(ser._errors, status=400)

    def destroy(self, request, pk=None):
        try:
            config = get_object_or_404(PiConfig, user=request.user, pk=pk)
            config.delete()
            return Response(status=200)
        except ValidationError:
            return Response({"id": [f"'{pk}' is not a valid UUID ID"]}, status=400)

   # def update(self, request, pk=None):
    #     pass

    # def partial_update(self, request, pk=None):
    #     pass
