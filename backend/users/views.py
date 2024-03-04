from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


class RegistroUsuarioAPIView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUsuarioAPIView(ObtainAuthToken):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if email is None or password is None:
            return Response({'error': 'Por favor, proporcione tanto email como contraseña'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({'error': 'Credenciales inválidas'},
                            status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.id_usuario}, status=status.HTTP_200_OK)
