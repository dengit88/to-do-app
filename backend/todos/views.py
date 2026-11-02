from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todos to be viewed, created, updated, or deleted (CRUD).
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def get_queryset(self):
        queryset = Todo.objects.all()
        # Optional query param filters
        completed_param = self.request.query_params.get('completed', None)
        if completed_param is not None:
            if completed_param.lower() in ['true', '1']:
                queryset = queryset.filter(completed=True)
            elif completed_param.lower() in ['false', '0']:
                queryset = queryset.filter(completed=False)

        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)

        return queryset
