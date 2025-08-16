from django.urls import path
from . import views

urlpatterns = [
    # City-related endpoints
    path('cities/', views.CityListView.as_view(), name='city-list'),
    path('cities/<str:name>/', views.CityDetailView.as_view(), name='city-detail'),
    
    # Season endpoints
    path('seasons/', views.SeasonListView.as_view(), name='season-list'),
    
    # Disease endpoints
    path('diseases/', views.DiseaseListView.as_view(), name='disease-list'),
    path('active-diseases/', views.ActiveDiseasesView.as_view(), name='active-diseases'),
    
    # City-specific health data endpoints
    path('cities/<str:city_name>/symptoms/', views.CitySymptomsView.as_view(), name='city-symptoms'),
    path('cities/<str:city_name>/preventive-measures/', views.CityPreventiveMeasuresView.as_view(), name='city-preventive-measures'),
    path('cities/<str:city_name>/treatment-guidelines/', views.CityTreatmentGuidelinesView.as_view(), name='city-treatment-guidelines'),
    path('cities/<str:city_name>/vaccination-centers/', views.CityVaccinationCentersView.as_view(), name='city-vaccination-centers'),
    path('cities/<str:city_name>/health-metrics/', views.CityHealthMetricsView.as_view(), name='city-health-metrics'),
    
    # General endpoints
    path('vaccines/', views.VaccineListView.as_view(), name='vaccine-list'),
    path('vaccination-centers/', views.VaccinationCenterListView.as_view(), name='vaccination-center-list'),
    
    # Utility endpoints
    path('prevention-tips/', views.prevention_tips_view, name='prevention-tips'),
    path('treatment-guidelines/', views.treatment_guidelines_view, name='treatment-guidelines'),
    path('dashboard-summary/', views.dashboard_summary_view, name='dashboard-summary'),
]
