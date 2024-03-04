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


class ListarSubsidiosPersona(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id_persona):
        subsidios = Subsidio.objects.filter(beneficiario__id=id_persona)
        serializer = SubsidioSerializer(subsidios, many=True)
        return Response(serializer.data)


class ListarSubsidiosOficina(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id_oficina, fecha_inicio, fecha_fin):
        print(f'Fecha inicio: {fecha_inicio}')
        print(f'Fecha fin: {fecha_fin}')
        print(f'Id oficina: {id_oficina}')

        oficina = Oficina.objects.get(nombre=id_oficina)
        pk = oficina.id_oficina

        subsidios = Subsidio.objects.filter(
            oficina_solicitante_id=pk, fecha_alta__range=[fecha_inicio, fecha_fin])

        serializer = SubsidioSerializer(subsidios, many=True)
        return Response(serializer.data)


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
