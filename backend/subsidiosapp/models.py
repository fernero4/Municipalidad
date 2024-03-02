from django.db import models


class Subsidio(models.Model):
    id_subsidio = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    oficina_solicitante = models.ForeignKey(
        'Oficina', on_delete=models.CASCADE)
    año = models.IntegerField()
    mes = models.IntegerField()
    estado = models.CharField(max_length=2, choices=(
        ('AC', 'Activo'), ('BA', 'Baja')))


class SubsidioDetalle(models.Model):
    id_subsidio_detalle = models.AutoField(primary_key=True)
    id_subsidio = models.ForeignKey('Subsidio', on_delete=models.CASCADE)
    id_beneficiario = models.ForeignKey(
        'Beneficiario', on_delete=models.CASCADE)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=255)


class Beneficiario(models.Model):
    id_beneficiario = models.AutoField(primary_key=True)
    tipo_documento = models.CharField(max_length=255)
    numero_documento = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)


class Oficina(models.Model):
    id_oficina = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
