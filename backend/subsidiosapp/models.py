from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model


class Oficina(models.Model):
    id_oficina = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255, null=True, blank=True)


class Subsidio(models.Model):
    id_subsidio = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    oficina_solicitante = models.ForeignKey(
        'Oficina', null=True, blank=True, on_delete=models.CASCADE)
    fecha_alta = models.DateField(default=timezone.now, null=True, blank=True)
    anio = models.IntegerField()
    mes = models.IntegerField()
    estado = models.CharField(max_length=2, choices=(
        ('AC', 'Activo'), ('BA', 'Baja')))


class Beneficiario(models.Model):
    id_beneficiario = models.AutoField(primary_key=True)
    tipo_documento = models.CharField(max_length=255)
    numero_documento = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)

    def clean(self):
        existing_subsidios = SubsidioDetalle.objects.filter(
            id_beneficiario=self.id_beneficiario,
            id_subsidio=self.id_subsidio
        ).exclude(pk=self.pk)
        if existing_subsidios.exists():
            raise ValidationError(
                'El beneficiario ya está registrado en este subsidio.')


class SubsidioDetalle(models.Model):
    id_subsidio_detalle = models.AutoField(primary_key=True)
    id_subsidio = models.ForeignKey('Subsidio', on_delete=models.CASCADE)
    id_beneficiario = models.ForeignKey(
        'Beneficiario', on_delete=models.CASCADE)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=255)

    def clean(self):
        existing_subsidios = SubsidioDetalle.objects.filter(
            id_beneficiario=self.id_beneficiario,
            id_subsidio__oficina_solicitante__id_oficina=self.id_subsidio.oficina_solicitante.id_oficina,
            id_subsidio__anio=self.id_subsidio.anio,
            id_subsidio__mes=self.id_subsidio.mes
        ).exclude(pk=self.pk)
        if existing_subsidios.exists():
            raise ValidationError(
                'El beneficiario ya está registrado en subsidios de diferentes oficinas en el mismo año/mes.')

        if self.importe > 1000000:
            raise ValidationError(
                'El importe no puede ser superior a $1.000.000,00 por beneficiario.')


class Auditoria(models.Model):
    ACCION_CHOICES = (
        ('C', 'Creación'),
        ('M', 'Modificación'),
        ('E', 'Eliminación'),
    )

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(default=timezone.now)
    accion = models.CharField(max_length=1, choices=ACCION_CHOICES)
    tabla = models.CharField(max_length=255)
    dato_modificado = models.TextField()

    class Meta:
        ordering = ['-fecha_hora']

    def __str__(self):
        return f"{self.usuario} - {self.fecha_hora}"


@receiver(post_save, sender=get_user_model())
def registrar_auditoria_creacion_modificacion(sender, instance, created, **kwargs):
    if not isinstance(instance, Auditoria):
        return

    if created:
        accion = 'C'
    else:
        accion = 'M'

    Auditoria.objects.create(
        usuario=instance.usuario,
        accion=accion,
        tabla=sender.__name__,
        dato_modificado=str(instance)
    )


@receiver(pre_delete, sender=get_user_model())
def registrar_auditoria_eliminacion(sender, instance, **kwargs):
    if not isinstance(instance, Auditoria):
        return

    Auditoria.objects.create(
        usuario=instance.usuario,
        accion='E',
        tabla=sender.__name__,
        dato_modificado=str(instance)
    )
