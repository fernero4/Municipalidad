from django.contrib import admin
from .models import Subsidio, SubsidioDetalle, Beneficiario, Oficina

admin.site.register(Subsidio)
admin.site.register(SubsidioDetalle)
admin.site.register(Beneficiario)
admin.site.register(Oficina)
