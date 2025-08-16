from rest_framework import serializers
from .models import (
    City, Season, Disease, Symptom, PreventiveMeasure, TreatmentGuideline,
    Vaccine, VaccinationCenter, DiseaseOutbreak, CityHealthMetrics
)


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = '__all__'


class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = '__all__'


class SymptomSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)

    class Meta:
        model = Symptom
        fields = '__all__'


class PreventiveMeasureSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)

    class Meta:
        model = PreventiveMeasure
        fields = '__all__'


class TreatmentGuidelineSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)

    class Meta:
        model = TreatmentGuideline
        fields = '__all__'




class VaccineSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)

    class Meta:
        model = Vaccine
        fields = '__all__'


class VaccinationCenterSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    available_vaccines = VaccineSerializer(many=True, read_only=True)

    class Meta:
        model = VaccinationCenter
        fields = '__all__'


class DiseaseOutbreakSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)
    hotspots_list = serializers.SerializerMethodField()

    class Meta:
        model = DiseaseOutbreak
        fields = '__all__'

    def get_hotspots_list(self, obj):
        if obj.hotspots:
            return [hotspot.strip() for hotspot in obj.hotspots.split(',')]
        return []


class CityHealthMetricsSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)

    class Meta:
        model = CityHealthMetrics
        fields = '__all__'


# Combined serializers for city-specific data
class CityDetailSerializer(serializers.ModelSerializer):
    symptoms = serializers.SerializerMethodField()
    preventive_measures = serializers.SerializerMethodField()
    treatment_guidelines = serializers.SerializerMethodField()
    vaccination_centers = VaccinationCenterSerializer(many=True, read_only=True)
    outbreaks = serializers.SerializerMethodField()
    health_metrics = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = '__all__'

    def get_symptoms(self, obj):
        season = self.context.get('season')
        if season:
            symptoms = obj.symptoms.filter(season__name=season)
            return SymptomSerializer(symptoms, many=True).data
        return []

    def get_preventive_measures(self, obj):
        season = self.context.get('season')
        if season:
            measures = obj.preventive_measures.filter(season__name=season)
            return PreventiveMeasureSerializer(measures, many=True).data
        return []

    def get_treatment_guidelines(self, obj):
        season = self.context.get('season')
        if season:
            guidelines = obj.treatment_guidelines.filter(season__name=season)
            return TreatmentGuidelineSerializer(guidelines, many=True).data
        return []

    def get_outbreaks(self, obj):
        season = self.context.get('season')
        if season:
            outbreaks = obj.outbreaks.filter(season__name=season)
            return DiseaseOutbreakSerializer(outbreaks, many=True).data
        return []

    def get_health_metrics(self, obj):
        season = self.context.get('season')
        if season:
            metrics = obj.health_metrics.filter(season__name=season).first()
            if metrics:
                return CityHealthMetricsSerializer(metrics).data
        return None
