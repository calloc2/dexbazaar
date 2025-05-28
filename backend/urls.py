"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from .views import RegisterUserView, BlockchainBalanceView, BlockchainTransactionView
from .views import RegisterUserView
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from .views import ProductListCreateView, UserProfileDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', obtain_auth_token, name='api_login'),
    path('api/users/register/', RegisterUserView.as_view(), name='api_register'),
    path('api/blockchain/balance/', BlockchainBalanceView.as_view(), name='blockchain_balance'),
    path('api/blockchain/transaction/', BlockchainTransactionView.as_view(), name='blockchain_transaction'),
    path('api/products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('api/users/<str:username>/', UserProfileDetailView.as_view(), name='user-profile-detail'),
    path('', TemplateView.as_view(template_name='index.html'), name='frontend'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Only catch-all for frontend routes, not media/static
urlpatterns += [
    re_path(r'^(?!api/|media/|static/).*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
