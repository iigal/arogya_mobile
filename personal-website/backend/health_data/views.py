from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    City, Season, Disease, Symptom, PreventiveMeasure, TreatmentGuideline,
    Vaccine, VaccinationCenter, DiseaseOutbreak, CityHealthMetrics
)
from .serializers import (
    CitySerializer, SeasonSerializer, DiseaseSerializer, SymptomSerializer,
    PreventiveMeasureSerializer, TreatmentGuidelineSerializer,
    VaccineSerializer, VaccinationCenterSerializer, DiseaseOutbreakSerializer,
    CityHealthMetricsSerializer, CityDetailSerializer
)


# City-related views
class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['region']


class CityDetailView(generics.RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityDetailSerializer
    lookup_field = 'name'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['season'] = self.request.query_params.get('season', 'monsoon')
        return context


# Season-related views
class SeasonListView(generics.ListAPIView):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer


# Disease-related views
class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.filter(is_active=True)
    serializer_class = DiseaseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


class ActiveDiseasesView(generics.ListAPIView):
    serializer_class = DiseaseOutbreakSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city__name', 'season__name', 'risk_level', 'trend']

    def get_queryset(self):
        return DiseaseOutbreak.objects.filter(active_cases__gt=0).order_by('-risk_level', '-active_cases')


# City-specific symptom views
class CitySymptomsView(generics.ListAPIView):
    serializer_class = SymptomSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['severity', 'is_common']

    def get_queryset(self):
        city_name = self.kwargs.get('city_name')
        season = self.request.query_params.get('season', 'monsoon')
        
        return Symptom.objects.filter(
            city__name__iexact=city_name,
            season__name__iexact=season
        ).order_by('order', 'symptom_text')


# City-specific preventive measures views
class CityPreventiveMeasuresView(generics.ListAPIView):
    serializer_class = PreventiveMeasureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'priority']

    def get_queryset(self):
        city_name = self.kwargs.get('city_name')
        season = self.request.query_params.get('season', 'monsoon')
        
        return PreventiveMeasure.objects.filter(
            city__name__iexact=city_name,
            season__name__iexact=season
        ).order_by('order', 'category')


# City-specific treatment guidelines views
class CityTreatmentGuidelinesView(generics.ListAPIView):
    serializer_class = TreatmentGuidelineSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['treatment_type']

    def get_queryset(self):
        city_name = self.kwargs.get('city_name')
        season = self.request.query_params.get('season', 'monsoon')
        
        return TreatmentGuideline.objects.filter(
            city__name__iexact=city_name,
            season__name__iexact=season
        ).order_by('order', 'treatment_type')




# Vaccination-related views
class VaccineListView(generics.ListAPIView):
    queryset = Vaccine.objects.filter(is_available=True)
    serializer_class = VaccineSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['disease__name', 'vaccine_type']


class VaccinationCenterListView(generics.ListAPIView):
    serializer_class = VaccinationCenterSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city__name', 'appointment_required', 'walk_in_available']

    def get_queryset(self):
        return VaccinationCenter.objects.filter(is_active=True)


class CityVaccinationCentersView(generics.ListAPIView):
    serializer_class = VaccinationCenterSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['appointment_required', 'walk_in_available']

    def get_queryset(self):
        city_name = self.kwargs.get('city_name')
        return VaccinationCenter.objects.filter(
            city__name__iexact=city_name,
            is_active=True
        ).order_by('name')


# City health metrics view
class CityHealthMetricsView(generics.RetrieveAPIView):
    serializer_class = CityHealthMetricsSerializer
    lookup_field = 'city__name'

    def get_object(self):
        city_name = self.kwargs.get('city_name')
        season = self.request.query_params.get('season', 'monsoon')
        
        try:
            return CityHealthMetrics.objects.get(
                city__name__iexact=city_name,
                season__name__iexact=season
            )
        except CityHealthMetrics.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(
                {"detail": "Health metrics not found for this city and season."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# Prevention tips view (general)
@api_view(['GET'])
def prevention_tips_view(request):
    """Get general prevention tips categorized by type"""
    category = request.query_params.get('category', None)
    
    queryset = PreventiveMeasure.objects.all()
    if category:
        queryset = queryset.filter(category=category)
    
    # Group by category
    tips_by_category = {}
    for measure in queryset:
        if measure.category not in tips_by_category:
            tips_by_category[measure.category] = []
        tips_by_category[measure.category].append({
            'measure_text': measure.measure_text,
            'priority': measure.priority,
            'city': measure.city.name,
            'season': measure.season.name
        })
    
    return Response(tips_by_category)


# Treatment guidelines view (general)
@api_view(['GET'])
def treatment_guidelines_view(request):
    """Get general treatment guidelines"""
    city = request.query_params.get('city', None)
    season = request.query_params.get('season', 'monsoon')
    treatment_type = request.query_params.get('type', None)
    
    queryset = TreatmentGuideline.objects.all()
    
    if city:
        queryset = queryset.filter(city__name__iexact=city)
    if season:
        queryset = queryset.filter(season__name__iexact=season)
    if treatment_type:
        queryset = queryset.filter(treatment_type=treatment_type)
    
    serializer = TreatmentGuidelineSerializer(queryset, many=True)
    return Response(serializer.data)


# Dashboard summary view
@api_view(['GET'])
def dashboard_summary_view(request):
    """Get dashboard summary data"""
    city = request.query_params.get('city', None)
    season = request.query_params.get('season', 'monsoon')
    
    # Get active diseases count
    active_diseases = DiseaseOutbreak.objects.filter(active_cases__gt=0)
    if city:
        active_diseases = active_diseases.filter(city__name__iexact=city)
    if season:
        active_diseases = active_diseases.filter(season__name__iexact=season)
    
    # Get vaccination centers count
    vaccination_centers = VaccinationCenter.objects.filter(is_active=True)
    if city:
        vaccination_centers = vaccination_centers.filter(city__name__iexact=city)
    
    # Get high-risk outbreaks
    high_risk_outbreaks = DiseaseOutbreak.objects.filter(
        risk_level__in=['high', 'critical']
    )
    if city:
        high_risk_outbreaks = high_risk_outbreaks.filter(city__name__iexact=city)
    if season:
        high_risk_outbreaks = high_risk_outbreaks.filter(season__name__iexact=season)
    
    summary_data = {
        'active_diseases_count': active_diseases.count(),
        'vaccination_centers_count': vaccination_centers.count(),
        'high_risk_outbreaks_count': high_risk_outbreaks.count(),
        'recent_outbreaks': DiseaseOutbreakSerializer(
            high_risk_outbreaks.order_by('-last_updated')[:5], many=True
        ).data
    }
    
    return Response(summary_data)
