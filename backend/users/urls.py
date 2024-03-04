from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.RegistroUsuarioAPIView.as_view(),
         name='registro_usuario'),
    path('login/', views.LoginUsuarioAPIView.as_view(), name='login_usuario'),
]
