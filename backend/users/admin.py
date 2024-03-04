from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "id_usuario", "password", )}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )

    search_fields = ('email', 'id_usuario',)
    ordering = ('id_usuario', 'email',)
    list_display = ('id_usuario', 'email', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'groups')


admin.site.register(CustomUser, CustomUserAdmin)
