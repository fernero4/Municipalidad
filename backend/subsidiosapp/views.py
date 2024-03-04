from rest_framework.exceptions import NotFound
from datetime import datetime
from .models import *
from .serializers import *
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from openpyxl import Workbook
from django.http import HttpResponse
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter


class OficinaAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=0):
        if pk == 0:
            oficina = Oficina.objects.all()
            oficina_Serializer = OficinaSerializer(oficina, many=True)
            datos = oficina_Serializer.data[:]
            return JsonResponse(datos, safe=False)
        else:
            oficina = Oficina.objects.get(id_oficina=pk)
            oficina_Serializer = OficinaSerializer(oficina)
            datos = oficina_Serializer.data
            return JsonResponse(datos, safe=False)

    def post(self, request):
        try:
            oficina_Serializer = OficinaSerializer(data=request.data)
            oficina_Serializer.is_valid(raise_exception=True)
            oficina_Serializer.save()
            return Response(oficina_Serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BeneficiarioAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=0):
        if pk == 0:
            beneficiario = Beneficiario.objects.all()
            beneficiario_Serializer = BeneficiarioSerializer(
                beneficiario, many=True)
            datos = beneficiario_Serializer.data[:]
            return JsonResponse(datos, safe=False)
        else:
            beneficiario = Beneficiario.objects.get(id_beneficiario=pk)
            beneficiario_Serializer = BeneficiarioSerializer(beneficiario)
            datos = beneficiario_Serializer.data
            return JsonResponse(datos, safe=False)

    def post(self, request):
        try:
            beneficiario_Serializer = BeneficiarioSerializer(data=request.data)
            beneficiario_Serializer.is_valid(raise_exception=True)
            beneficiario_Serializer.save()
            return Response(beneficiario_Serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SubsidioAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=0):
        data = []

        if pk == 0:
            subsidios = Subsidio.objects.all()
            subsidio_serializer = SubsidioSerializer(subsidios, many=True)
            for subsidio in subsidio_serializer.data:
                subsidio_temp = dict(subsidio)
                subsidio_temp['fecha_alta'] = datetime.strptime(
                    subsidio['fecha_alta'], '%Y-%m-%d').strftime('%d-%m-%Y')
                oficina = Oficina.objects.get(
                    id_oficina=subsidio['oficina_solicitante'])
                subsidio_temp['oficina_solicitante_nombre'] = oficina.nombre
                data.append(subsidio_temp)
            return Response(data)
        else:
            try:
                subsidio = Subsidio.objects.get(id_subsidio=pk)
                subsidio_serializer = SubsidioSerializer(subsidio)
                return Response(subsidio_serializer.data)
            except Subsidio.DoesNotExist:
                raise NotFound(detail="Subsidio no encontrado")

    def post(self, request):
        try:
            nombre_oficina = request.data['oficina_solicitante_nombre']
            anio = int(request.data['anio'])
            mes = int(request.data['mes'])
            oficina = Oficina.objects.get(nombre=nombre_oficina)

            subsidio_serializer = SubsidioSerializer(data={
                'descripcion': request.data['descripcion'],
                'oficina_solicitante': oficina.id_oficina,
                'anio': anio,
                'mes': mes,
                'estado': 'AC'
            })

            if subsidio_serializer.is_valid():
                subsidio = subsidio_serializer.save()
                fecha_formateada = subsidio.fecha_alta.strftime('%d-%m-%Y')

                data = {
                    'id_subsidio': subsidio.id_subsidio,
                    'descripcion': subsidio.descripcion,
                    'oficina_solicitante_nombre': nombre_oficina,
                    'fecha_alta': fecha_formateada,
                    'anio': subsidio.anio,
                    'mes': subsidio.mes,
                    'estado': subsidio.estado
                }

                return Response(data, status=status.HTTP_201_CREATED)
            else:
                return Response(subsidio_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Oficina.DoesNotExist:
            return Response({'Error': 'La oficina solicitante no existe'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'Error': 'Hubo un problema al recibir la información del subsidio'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            subsidio = Subsidio.objects.get(pk=pk)
            subsidio.estado = 'BA'
            subsidio.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Subsidio.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class SubsidioAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=0):
        data = []

        if pk == 0:
            subsidios = Subsidio.objects.all()
            subsidio_serializer = SubsidioSerializer(subsidios, many=True)
            for subsidio in subsidio_serializer.data:
                subsidio_temp = dict(subsidio)
                subsidio_temp['fecha_alta'] = datetime.strptime(
                    subsidio['fecha_alta'], '%Y-%m-%d').strftime('%d-%m-%Y')
                oficina = Oficina.objects.get(
                    id_oficina=subsidio['oficina_solicitante'])
                subsidio_temp['oficina_solicitante_nombre'] = oficina.nombre

                # Buscar detalles de subsidio y agregar importe y estado si existen
                detalles = SubsidioDetalle.objects.filter(
                    id_subsidio=subsidio['id_subsidio'])
                if detalles.exists():
                    detalle = detalles.first()
                    subsidio_temp['importe'] = detalle.importe
                    subsidio_temp['estado_detalle'] = detalle.estado

                data.append(subsidio_temp)
            return Response(data)
        else:
            try:
                subsidio = Subsidio.objects.get(id_subsidio=pk)
                subsidio_serializer = SubsidioSerializer(subsidio)
                return Response(subsidio_serializer.data)
            except Subsidio.DoesNotExist:
                raise NotFound(detail="Subsidio no encontrado")


class SubsidioDetalleAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=0):
        if pk == 0:
            detalles_subsidios = SubsidioDetalle.objects.all()
            detalles_subsidios_serializer = SubsidioDetalleSerializer(
                detalles_subsidios, many=True)
            return Response(detalles_subsidios_serializer.data)
        else:
            try:
                detalle_subsidio = SubsidioDetalle.objects.get(
                    id_subsidio_detalle=pk)
                detalle_subsidio_serializer = SubsidioDetalleSerializer(
                    detalle_subsidio)
                return Response(detalle_subsidio_serializer.data)
            except SubsidioDetalle.DoesNotExist:
                raise NotFound(detail="Detalle de subsidio no encontrado")

    def post(self, request):
        beneficiario_data = request.data.pop('beneficiario', None)
        if beneficiario_data:
            beneficiario, created = Beneficiario.objects.get_or_create(
                **beneficiario_data)
            request.data['id_beneficiario'] = beneficiario.id_beneficiario

        subsidio_detalle_serializer = SubsidioDetalleSerializer(
            data=request.data)

        if subsidio_detalle_serializer.is_valid():
            subsidio_detalle_serializer.save()
            return Response(subsidio_detalle_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(subsidio_detalle_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            detalle_subsidio = SubsidioDetalle.objects.get(
                id_subsidio_detalle=pk)
            detalle_subsidio.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SubsidioDetalle.DoesNotExist:
            raise NotFound(detail="Detalle de subsidio no encontrado")


class ListarSubsidiosPersona(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, nombre_apellido):
        beneficiarios = Beneficiario.objects.filter(
            apellido__icontains=nombre_apellido) | Beneficiario.objects.filter(
            nombre__icontains=nombre_apellido)
        subsidios = Subsidio.objects.filter(
            subsidiodetalle__id_beneficiario__in=beneficiarios.values_list('id_beneficiario', flat=True))
        serializer = SubsidioSerializer(subsidios, many=True)
        data = []
        for subsidio in serializer.data:
            subsidio_temp = dict(subsidio)
            subsidio_temp['fecha_alta'] = datetime.strptime(
                subsidio['fecha_alta'], '%Y-%m-%d').strftime('%d-%m-%Y')
            oficina = Oficina.objects.get(
                id_oficina=subsidio['oficina_solicitante'])
            subsidio_temp['oficina_solicitante_nombre'] = oficina.nombre

            detalles = SubsidioDetalle.objects.filter(
                id_subsidio=subsidio['id_subsidio'])
            if detalles.exists():
                detalle = detalles.first()
                subsidio_temp['importe'] = detalle.importe
                subsidio_temp['estado_detalle'] = detalle.estado

            data.append(subsidio_temp)
        return Response(data)


class ListarSubsidiosOficina(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, nombre_oficina, fecha_inicio, fecha_fin):
        oficina = Oficina.objects.get(nombre=nombre_oficina)
        pk = oficina.id_oficina

        subsidios = Subsidio.objects.filter(
            oficina_solicitante_id=pk, fecha_alta__range=[fecha_inicio, fecha_fin])

        data = []
        for subsidio in subsidios:
            subsidio_data = {
                'id_subsidio': subsidio.id_subsidio,
                'descripcion': subsidio.descripcion,
                'oficina_solicitante_nombre': oficina.nombre,
                'fecha_alta': subsidio.fecha_alta.strftime('%d-%m-%Y'),
                'anio': subsidio.anio,
                'mes': subsidio.mes,
                'estado': subsidio.estado,
            }

            detalles = SubsidioDetalle.objects.filter(
                id_subsidio=subsidio.id_subsidio)
            if detalles.exists():
                detalle = detalles.first()
                subsidio_data['importe'] = detalle.importe
                subsidio_data['estado_detalle'] = detalle.estado

            data.append(subsidio_data)

        return Response(data)


class ExportSubsidiosExcel(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id_persona=None, id_oficina=None, fecha_inicio=None, fecha_fin=None):
        if id_persona:
            response_data = ListarSubsidiosPersona.as_view()(
                request, id_persona=id_persona).data
        elif id_oficina and fecha_inicio and fecha_fin:
            response_data = ListarSubsidiosOficina.as_view()(request, id_oficina=id_oficina,
                                                             fecha_inicio=fecha_inicio, fecha_fin=fecha_fin).data
        else:
            return Response({'error': 'Parámetros incorrectos'}, status=status.HTTP_400_BAD_REQUEST)

        workbook = Workbook()
        sheet = workbook.active
        sheet.title = 'Subsidios'

        for idx, item in enumerate(response_data, start=1):
            sheet[f'A{idx}'] = item['descripcion']
            sheet[f'B{idx}'] = item['importe']
            sheet[f'C{idx}'] = item['estado']

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=subsidios.xlsx'
        workbook.save(response)

        return response


class ImprimirSubsidioAPIView(APIView):
    def get(self, request, id_subsidio):
        try:
            subsidio = Subsidio.objects.get(id_subsidio=id_subsidio)
            subsidio_data = {
                'id_subsidio': subsidio.id_subsidio,
                'descripcion': subsidio.descripcion,
                'fecha_alta': subsidio.fecha_alta.strftime('%d-%m-%Y'),
                'anio': subsidio.anio,
                'mes': subsidio.mes,
                'estado': subsidio.estado,
            }

            try:
                subsidio_detalle = SubsidioDetalle.objects.get(
                    id_subsidio=subsidio)
                beneficiario = subsidio_detalle.id_beneficiario
                subsidio_data.update({
                    'id_subsidio_detalle': subsidio_detalle.id_subsidio_detalle,
                    'importe': subsidio_detalle.importe,
                    'estado_subsidio_detalle': subsidio_detalle.estado,
                    'id_beneficiario': beneficiario.id_beneficiario,
                    'tipo_documento_beneficiario': beneficiario.tipo_documento,
                    'numero_documento_beneficiario': beneficiario.numero_documento,
                    'apellido_beneficiario': beneficiario.apellido,
                    'nombre_beneficiario': beneficiario.nombre,
                })
            except SubsidioDetalle.DoesNotExist:
                pass

            buffer = BytesIO()
            pdf = canvas.Canvas(buffer)
            pdf.drawString(
                100, 800, f"ID Subsidio: {subsidio_data['id_subsidio']}")
            pdf.drawString(
                100, 780, f"Descripción: {subsidio_data['descripcion']}")
            pdf.drawString(
                100, 760, f"Fecha Alta: {subsidio_data['fecha_alta']}")
            pdf.drawString(100, 740, f"Año: {subsidio_data['anio']}")
            pdf.drawString(100, 720, f"Mes: {subsidio_data['mes']}")
            pdf.drawString(100, 700, f"Estado: {subsidio_data['estado']}")

            if 'id_subsidio_detalle' in subsidio_data:
                pdf.drawString(
                    100, 680, f"ID Subsidio Detalle: {subsidio_data['id_subsidio_detalle']}")
                pdf.drawString(
                    100, 660, f"Importe: {subsidio_data['importe']}")
                pdf.drawString(
                    100, 640, f"Estado Subsidio Detalle: {subsidio_data['estado_subsidio_detalle']}")
                pdf.drawString(
                    100, 620, f"ID Beneficiario: {subsidio_data['id_beneficiario']}")
                pdf.drawString(
                    100, 600, f"Tipo Documento Beneficiario: {subsidio_data['tipo_documento_beneficiario']}")
                pdf.drawString(
                    100, 580, f"Número Documento Beneficiario: {subsidio_data['numero_documento_beneficiario']}")
                pdf.drawString(
                    100, 560, f"Apellido Beneficiario: {subsidio_data['apellido_beneficiario']}")
                pdf.drawString(
                    100, 540, f"Nombre Beneficiario: {subsidio_data['nombre_beneficiario']}")

            pdf.showPage()
            pdf.save()

            buffer.seek(0)
            response = HttpResponse(
                buffer.read(), content_type='application/pdf')
            response[
                'Content-Disposition'] = f'attachment; filename=imprimir_subsidio_{id_subsidio}.pdf'
            return response
        except Subsidio.DoesNotExist:
            return Response({'error': 'Subsidio no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Beneficiario.DoesNotExist:
            return Response({'error': 'Beneficiario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
