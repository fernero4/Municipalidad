from .views import *
from .models import *
from django.urls import path, re_path

urlpatterns = [

    path('oficina/', OficinaAPIView.as_view(),
         name='oficina'),
    path('beneficiario/', BeneficiarioAPIView.as_view(), name='beneficiario'),
    path('subsidio/', SubsidioAPIView.as_view(), name='subsidio'),
    path('subsidio/<int:pk>/', SubsidioAPIView.as_view(), name='subsidio'),

    path('subsidiogrilla/', SubsidioAPIView.as_view(), name='subsidiogrilla'),
    path('subsidiodetalle/', SubsidioDetalleAPIView.as_view(),
         name='subsidiodetalle'),
    path('subsidiodetalle/<int:pk>/', SubsidioDetalleAPIView.as_view(),
         name='subsidiodetalle'),
    path('listarporpersona/<str:nombre_apellido>/',
         ListarSubsidiosPersona.as_view(), name='listarporpersona'),

    #     path('listarsubsidioporfecha/',
    #          ListarSubsidiosOficina.as_view(), name='listarsubsidio'),
    path('listarsubsidio/<str:nombre_oficina>/<str:fecha_inicio>/<str:fecha_fin>/',
         ListarSubsidiosOficina.as_view(), name='listarsubsidio'),

    path('exportarlistado/', ExportSubsidiosExcel.as_view(), name='exportarlistado'),
    path('imprimir_subsidio/<int:id_subsidio>/',
         ImprimirSubsidioAPIView.as_view(), name='imprimir_subsidio'),

]
