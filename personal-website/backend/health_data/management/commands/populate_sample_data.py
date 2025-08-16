from django.core.management.base import BaseCommand
from health_data.models import (
    City, Season, Disease, Symptom, PreventiveMeasure, TreatmentGuideline,
    Hospital, Vaccine, VaccinationCenter, DiseaseOutbreak, CityHealthMetrics
)


class Command(BaseCommand):
    help = 'Populate database with sample health data for E-Arogya app'

    def handle(self, *args, **options):
        self.stdout.write('Populating sample data...')

        # Create seasons
        seasons_data = [
            {'name': 'monsoon', 'start_month': 6, 'end_month': 9, 'description': 'Rainy season with high humidity'},
            {'name': 'summer', 'start_month': 3, 'end_month': 5, 'description': 'Hot and dry season'},
            {'name': 'winter', 'start_month': 12, 'end_month': 2, 'description': 'Cold and dry season'},
        ]

        for season_data in seasons_data:
            season, created = Season.objects.get_or_create(
                name=season_data['name'],
                defaults=season_data
            )
            if created:
                self.stdout.write(f'Created season: {season.name}')

        # Create cities
        cities_data = [
            {'name': 'Kathmandu', 'region': 'Central', 'population': 1442271, 'latitude': 27.7172, 'longitude': 85.3240, 'air_quality_index': 85},
            {'name': 'Pokhara', 'region': 'Western', 'population': 518452, 'latitude': 28.2096, 'longitude': 83.9856, 'air_quality_index': 65},
            {'name': 'Chitwan', 'region': 'Central', 'population': 579984, 'latitude': 27.5291, 'longitude': 84.3542, 'air_quality_index': 70},
            {'name': 'Dharan', 'region': 'Eastern', 'population': 173096, 'latitude': 26.8147, 'longitude': 87.2769, 'air_quality_index': 60},
            {'name': 'Butwal', 'region': 'Western', 'population': 138742, 'latitude': 27.7000, 'longitude': 83.4500, 'air_quality_index': 75},
        ]

        for city_data in cities_data:
            city, created = City.objects.get_or_create(
                name=city_data['name'],
                defaults=city_data
            )
            if created:
                self.stdout.write(f'Created city: {city.name}')

        # Create diseases
        diseases_data = [
            {'name': 'Seasonal Flu', 'category': 'Viral Infection', 'description': 'Common seasonal influenza'},
            {'name': 'Dengue Fever', 'category': 'Vector-borne Disease', 'description': 'Mosquito-borne viral infection'},
            {'name': 'Typhoid', 'category': 'Bacterial Infection', 'description': 'Bacterial infection from contaminated food/water'},
            {'name': 'Malaria', 'category': 'Vector-borne Disease', 'description': 'Mosquito-borne parasitic infection'},
            {'name': 'Diarrheal Diseases', 'category': 'Gastrointestinal', 'description': 'Various causes of diarrhea'},
        ]

        for disease_data in diseases_data:
            disease, created = Disease.objects.get_or_create(
                name=disease_data['name'],
                defaults=disease_data
            )
            if created:
                self.stdout.write(f'Created disease: {disease.name}')

        # Create hospitals

        # Create vaccines
        vaccines_data = [
            {'name': 'Influenza Vaccine', 'disease': 'Seasonal Flu', 'vaccine_type': 'Inactivated', 'effectiveness_percentage': 85, 'duration_months': 12},
            {'name': 'Typhoid Vaccine', 'disease': 'Typhoid', 'vaccine_type': 'Live Attenuated', 'effectiveness_percentage': 75, 'duration_months': 36},
        ]

        for vaccine_data in vaccines_data:
            disease = Disease.objects.get(name=vaccine_data['disease'])
            vaccine, created = Vaccine.objects.get_or_create(
                name=vaccine_data['name'],
                disease=disease,
                defaults={
                    'vaccine_type': vaccine_data['vaccine_type'],
                    'effectiveness_percentage': vaccine_data['effectiveness_percentage'],
                    'duration_months': vaccine_data['duration_months']
                }
            )
            if created:
                self.stdout.write(f'Created vaccine: {vaccine.name}')

        # Create sample symptoms, preventive measures, and treatment guidelines for each city-season-disease combination
        cities = City.objects.all()
        seasons = Season.objects.all()
        diseases = Disease.objects.all()

        for city in cities:
            for season in seasons:
                for disease in diseases:
                    # Create symptoms
                    symptoms_data = self.get_symptoms_data(city.name, season.name, disease.name)
                    for symptom_data in symptoms_data:
                        Symptom.objects.get_or_create(
                            disease=disease,
                            city=city,
                            season=season,
                            symptom_text=symptom_data['symptom_text'],
                            defaults={
                                'severity': symptom_data['severity'],
                                'is_common': symptom_data['is_common'],
                                'order': symptom_data['order']
                            }
                        )

                    # Create preventive measures
                    measures_data = self.get_preventive_measures_data(city.name, season.name, disease.name)
                    for measure_data in measures_data:
                        PreventiveMeasure.objects.get_or_create(
                            disease=disease,
                            city=city,
                            season=season,
                            measure_text=measure_data['measure_text'],
                            defaults={
                                'category': measure_data['category'],
                                'priority': measure_data['priority'],
                                'order': measure_data['order']
                            }
                        )

                    # Create treatment guidelines
                    treatments_data = self.get_treatment_guidelines_data(city.name, season.name, disease.name)
                    for treatment_data in treatments_data:
                        TreatmentGuideline.objects.get_or_create(
                            disease=disease,
                            city=city,
                            season=season,
                            treatment_type=treatment_data['treatment_type'],
                            guideline_text=treatment_data['guideline_text'],
                            defaults={
                                'dosage': treatment_data.get('dosage', ''),
                                'duration': treatment_data.get('duration', ''),
                                'precautions': treatment_data.get('precautions', ''),
                                'order': treatment_data['order']
                            }
                        )

                # Create disease outbreaks
                outbreak_data = self.get_outbreak_data(city.name, season.name)
                for disease_name, data in outbreak_data.items():
                    disease = Disease.objects.get(name=disease_name)
                    DiseaseOutbreak.objects.get_or_create(
                        disease=disease,
                        city=city,
                        season=season,
                        defaults=data
                    )

                # Create city health metrics
                metrics_data = self.get_health_metrics_data(city.name, season.name)
                CityHealthMetrics.objects.get_or_create(
                    city=city,
                    season=season,
                    defaults=metrics_data
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated sample data!'))

    def get_symptoms_data(self, city, season, disease):
        """Get symptoms data based on city, season, and disease"""
        base_symptoms = {
            'Seasonal Flu': [
                {'symptom_text': 'Fever and chills', 'severity': 'moderate', 'is_common': True, 'order': 1},
                {'symptom_text': 'Cough and sore throat', 'severity': 'mild', 'is_common': True, 'order': 2},
                {'symptom_text': 'Body aches and fatigue', 'severity': 'moderate', 'is_common': True, 'order': 3},
                {'symptom_text': 'Headache', 'severity': 'mild', 'is_common': True, 'order': 4},
            ],
            'Dengue Fever': [
                {'symptom_text': 'High fever (40°C/104°F)', 'severity': 'severe', 'is_common': True, 'order': 1},
                {'symptom_text': 'Severe headache', 'severity': 'severe', 'is_common': True, 'order': 2},
                {'symptom_text': 'Pain behind eyes', 'severity': 'moderate', 'is_common': True, 'order': 3},
                {'symptom_text': 'Muscle and joint pain', 'severity': 'severe', 'is_common': True, 'order': 4},
            ],
            'Typhoid': [
                {'symptom_text': 'Prolonged fever', 'severity': 'severe', 'is_common': True, 'order': 1},
                {'symptom_text': 'Weakness and fatigue', 'severity': 'moderate', 'is_common': True, 'order': 2},
                {'symptom_text': 'Stomach pain', 'severity': 'moderate', 'is_common': True, 'order': 3},
                {'symptom_text': 'Loss of appetite', 'severity': 'mild', 'is_common': True, 'order': 4},
            ]
        }
        
        return base_symptoms.get(disease, [])

    def get_preventive_measures_data(self, city, season, disease):
        """Get preventive measures data based on city, season, and disease"""
        base_measures = {
            'Seasonal Flu': [
                {'measure_text': 'Get annual flu vaccination', 'category': 'personal', 'priority': 'high', 'order': 1},
                {'measure_text': 'Wash hands frequently with soap', 'category': 'personal', 'priority': 'high', 'order': 2},
                {'measure_text': 'Avoid close contact with sick people', 'category': 'social', 'priority': 'medium', 'order': 3},
                {'measure_text': 'Cover cough and sneeze', 'category': 'personal', 'priority': 'high', 'order': 4},
            ],
            'Dengue Fever': [
                {'measure_text': 'Eliminate standing water around home', 'category': 'environmental', 'priority': 'critical', 'order': 1},
                {'measure_text': 'Use mosquito repellent', 'category': 'personal', 'priority': 'high', 'order': 2},
                {'measure_text': 'Wear long-sleeved clothing', 'category': 'personal', 'priority': 'medium', 'order': 3},
                {'measure_text': 'Use bed nets while sleeping', 'category': 'personal', 'priority': 'high', 'order': 4},
            ]
        }
        
        return base_measures.get(disease, [])

    def get_treatment_guidelines_data(self, city, season, disease):
        """Get treatment guidelines data based on city, season, and disease"""
        base_treatments = {
            'Seasonal Flu': [
                {'treatment_type': 'immediate', 'guideline_text': 'Rest and increase fluid intake', 'order': 1},
                {'treatment_type': 'medication', 'guideline_text': 'Paracetamol for fever and pain', 'dosage': '500mg every 6 hours', 'duration': '3-5 days', 'order': 2},
                {'treatment_type': 'supportive', 'guideline_text': 'Warm salt water gargle for sore throat', 'order': 3},
            ],
            'Dengue Fever': [
                {'treatment_type': 'immediate', 'guideline_text': 'Immediate medical attention required', 'order': 1},
                {'treatment_type': 'supportive', 'guideline_text': 'Maintain fluid balance and monitor platelet count', 'order': 2},
                {'treatment_type': 'emergency', 'guideline_text': 'Hospitalization for severe cases', 'precautions': 'Avoid aspirin and NSAIDs', 'order': 3},
            ]
        }
        
        return base_treatments.get(disease, [])

    def get_outbreak_data(self, city, season):
        """Get outbreak data for city and season"""
        outbreaks = {
            'Seasonal Flu': {
                'reported_cases': 150,
                'active_cases': 45,
                'recovered_cases': 100,
                'death_cases': 5,
                'risk_level': 'medium',
                'trend': 'stable',
                'hotspots': 'Schools, Markets, Public Transport',
                'local_factors': 'Crowded areas and poor ventilation increase transmission risk'
            },
            'Dengue Fever': {
                'reported_cases': 80,
                'active_cases': 25,
                'recovered_cases': 50,
                'death_cases': 5,
                'risk_level': 'high',
                'trend': 'increasing',
                'hotspots': 'Residential areas with water storage',
                'local_factors': 'Monsoon season increases mosquito breeding sites'
            }
        }
        
        # Adjust based on season
        if season == 'monsoon':
            outbreaks['Dengue Fever']['active_cases'] = 40
            outbreaks['Dengue Fever']['risk_level'] = 'critical'
        
        return outbreaks

    def get_health_metrics_data(self, city, season):
        """Get health metrics data for city and season"""
        base_metrics = {
            'vaccination_rate': 75.5,
            'air_quality_status': 'Moderate - AQI 85',
            'water_safety_status': 'Generally safe with proper treatment',
            'healthcare_capacity': '80% occupied',
            'emergency_response_time': '15-20 minutes',
            'medicine_availability': 'Good availability of essential medicines',
            'special_programs': 'Free vaccination drives, Health awareness campaigns'
        }
        
        # Adjust based on city
        city_adjustments = {
            'Kathmandu': {'vaccination_rate': 85.0, 'air_quality_status': 'Poor - AQI 120'},
            'Pokhara': {'vaccination_rate': 80.0, 'air_quality_status': 'Good - AQI 65'},
            'Chitwan': {'vaccination_rate': 70.0, 'air_quality_status': 'Moderate - AQI 70'},
        }
        
        if city in city_adjustments:
            base_metrics.update(city_adjustments[city])
        
        return base_metrics
