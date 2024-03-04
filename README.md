## Instalación

### Requisitos previos

- Python
- Visual Studio Code
- PostgreSQL
- Git
- GitHub Desktop
- NodeJS

### Pasos de instalación

1. **Clonar el repositorio**
bash
git clone https://github.com/tu-usuario/pdts-donaciones.git
cd pdts-donaciones

Instalar dependencias para el backend
cd backend
python -m venv env
# En Windows:
.\env\Scripts\activate
# En Linux/MacOS:
source env/bin/activate
pip install -r requirements.txt

Configurar la base de datos PostgreSQL
Crear una base de datos en PostgreSQL con los siguientes datos:
Nombre: subsidio_bd
Contraseña: root

Migrar la base de datos y crear un superusuario
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

Correr servidor:
  python manage.py runserver

Instalación del frontend (ReactJS)
En la carpeta frontend\subsidios-frontend:

Verificar que nodeenv se instalo correctamente:
  nodeenv --version

Instalar dependencias del frontend
npm install react-router-dom
npm install axios
npm install jspdf xlsx

Poner en marcha el frontend (se abrirá el navegador en la direccion http://localhost:3000/)
npm start

Ejecución completa del programa
