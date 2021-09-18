from django.db.models import Q
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import  Product,Category
from rest_framework.decorators import api_view,permission_classes

from .serializers import ProductSerializer,CategorySerializer

from rest_framework.permissions import IsAuthenticated


class LatestProductsList(APIView):
    permission_classes = (IsAuthenticated,)  
    def get(self,request,format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    permission_classes = (IsAuthenticated,) 
    def get_object(self,category_slug,product_slug):
        try:
            return Product.objects.filter(category__slug=category_slug).get(slug=product_slug)
        except Product.DoesNotExist:
            raise Http404
    def get(self,request,category_slug,product_slug,format=None):
        product = self.get_object(category_slug,product_slug)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
class CategoryDetail(APIView):
    permission_classes = (IsAuthenticated,) 
    def get_object(self,category_slug):
        try:
            return Category.objects.get(slug=category_slug)
        except Product.DoesNotExist:
            raise Http404
    def get(self,request,category_slug,format=None):
        category = self.get_object(category_slug)
        serializer = CategorySerializer(category)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])

def search(request):
    
    query = request.data.get('query','')
    if query:
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    else:
        return Response({"products":[]})





    