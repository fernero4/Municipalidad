from rest_framework import serializers
from .models import *


class OficinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficina
        fields = '__all__'


class SubsidioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsidio
        fields = '__all__'


class BeneficiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiario
        fields = '__all__'


class SubsidioDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubsidioDetalle
        fields = '__all__'
