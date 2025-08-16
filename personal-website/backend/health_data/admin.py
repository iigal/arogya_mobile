from django.contrib import admin
from .models import (
    City, Season, Disease, Symptom, PreventiveMeasure, TreatmentGuideline,
    Vaccine, VaccinationCenter, DiseaseOutbreak, CityHealthMetrics
)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'population', 'air_quality_index']
    list_filter = ['region']
    search_fields = ['name', 'region']


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_month', 'end_month']


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'category']


@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    list_display = ['disease', 'city', 'season', 'symptom_text', 'severity']
    list_filter = ['disease', 'city', 'season', 'severity']
    search_fields = ['symptom_text']


@admin.register(PreventiveMeasure)
class PreventiveMeasureAdmin(admin.ModelAdmin):
    list_display = ['disease', 'city', 'season', 'category', 'priority']
    list_filter = ['disease', 'city', 'season', 'category', 'priority']
    search_fields = ['measure_text']


@admin.register(TreatmentGuideline)
class TreatmentGuidelineAdmin(admin.ModelAdmin):
    list_display = ['disease', 'city', 'season', 'treatment_type']
    list_filter = ['disease', 'city', 'season', 'treatment_type']
    search_fields = ['guideline_text']




@admin.register(Vaccine)
class VaccineAdmin(admin.ModelAdmin):
    list_display = ['name', 'disease', 'vaccine_type', 'effectiveness_percentage', 'is_available']
    list_filter = ['disease', 'vaccine_type', 'is_available']
    search_fields = ['name']


@admin.register(VaccinationCenter)
class VaccinationCenterAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'appointment_required', 'walk_in_available', 'is_active']
    list_filter = ['city', 'appointment_required', 'walk_in_available', 'is_active']
    search_fields = ['name', 'address']


@admin.register(DiseaseOutbreak)
class DiseaseOutbreakAdmin(admin.ModelAdmin):
    list_display = ['disease', 'city', 'season', 'active_cases', 'risk_level', 'trend', 'last_updated']
    list_filter = ['disease', 'city', 'season', 'risk_level', 'trend']
    search_fields = ['hotspots', 'local_factors']


@admin.register(CityHealthMetrics)
class CityHealthMetricsAdmin(admin.ModelAdmin):
    list_display = ['city', 'season', 'vaccination_rate', 'air_quality_status', 'last_updated']
    list_filter = ['city', 'season']
    search_fields = ['air_quality_status', 'water_safety_status']
