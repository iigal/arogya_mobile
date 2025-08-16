from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class City(models.Model):
    """Model for cities in Nepal"""
    name = models.CharField(max_length=100, unique=True)
    region = models.CharField(max_length=50)
    population = models.IntegerField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    air_quality_index = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.region})"


class Season(models.Model):
    """Model for seasons"""
    SEASON_CHOICES = [
        ('monsoon', 'Monsoon'),
        ('summer', 'Summer'),
        ('winter', 'Winter'),
    ]
    
    name = models.CharField(max_length=20, choices=SEASON_CHOICES, unique=True)
    start_month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    end_month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    description = models.TextField(blank=True)

    def __str__(self):
        return self.get_name_display()


class Disease(models.Model):
    """Model for diseases"""
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Symptom(models.Model):
    """Model for disease symptoms"""
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='symptoms')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='symptoms')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='symptoms')
    symptom_text = models.CharField(max_length=200)
    severity = models.CharField(max_length=20, choices=[
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
        ('critical', 'Critical'),
    ])
    is_common = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'symptom_text']
        unique_together = ['disease', 'city', 'season', 'symptom_text']

    def __str__(self):
        return f"{self.disease.name} - {self.symptom_text}"


class PreventiveMeasure(models.Model):
    """Model for preventive measures"""
    CATEGORY_CHOICES = [
        ('personal', 'Personal Hygiene'),
        ('environmental', 'Environmental Safety'),
        ('food', 'Food Safety'),
        ('social', 'Social Distancing'),
        ('local', 'Local Specific'),
    ]

    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='preventive_measures')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='preventive_measures')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='preventive_measures')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    measure_text = models.CharField(max_length=300)
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ])
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'measure_text']
        unique_together = ['disease', 'city', 'season', 'measure_text']

    def __str__(self):
        return f"{self.disease.name} - {self.measure_text[:50]}"


class TreatmentGuideline(models.Model):
    """Model for treatment guidelines"""
    TREATMENT_TYPES = [
        ('immediate', 'Immediate Treatment'),
        ('supportive', 'Supportive Care'),
        ('medication', 'Medication'),
        ('hospitalization', 'Hospitalization'),
        ('emergency', 'Emergency Care'),
    ]

    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='treatment_guidelines')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='treatment_guidelines')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='treatment_guidelines')
    treatment_type = models.CharField(max_length=20, choices=TREATMENT_TYPES)
    guideline_text = models.TextField()
    dosage = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    precautions = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'treatment_type']
        unique_together = ['disease', 'city', 'season', 'treatment_type', 'guideline_text']

    def __str__(self):
        return f"{self.disease.name} - {self.treatment_type}"




class Vaccine(models.Model):
    """Model for vaccines"""
    name = models.CharField(max_length=100, unique=True)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='vaccines')
    vaccine_type = models.CharField(max_length=50)
    effectiveness_percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    duration_months = models.IntegerField()
    side_effects = models.TextField(blank=True)
    contraindications = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.disease.name}"


class VaccinationCenter(models.Model):
    """Model for vaccination centers"""
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='vaccination_centers')
    address = models.TextField()
    phone = models.CharField(max_length=20)
    operating_hours = models.CharField(max_length=100)
    available_vaccines = models.ManyToManyField(Vaccine, related_name='vaccination_centers')
    appointment_required = models.BooleanField(default=False)
    walk_in_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.city.name}"


class DiseaseOutbreak(models.Model):
    """Model for tracking disease outbreaks"""
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='outbreaks')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='outbreaks')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='outbreaks')
    reported_cases = models.IntegerField(default=0)
    active_cases = models.IntegerField(default=0)
    recovered_cases = models.IntegerField(default=0)
    death_cases = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ])
    trend = models.CharField(max_length=20, choices=[
        ('decreasing', 'Decreasing'),
        ('stable', 'Stable'),
        ('increasing', 'Increasing'),
    ])
    hotspots = models.TextField(help_text="Comma-separated list of hotspot areas")
    local_factors = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_updated']
        unique_together = ['disease', 'city', 'season']

    def __str__(self):
        return f"{self.disease.name} in {self.city.name} - {self.risk_level}"


class CityHealthMetrics(models.Model):
    """Model for city health metrics"""
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='health_metrics')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='health_metrics')
    vaccination_rate = models.DecimalField(max_digits=5, decimal_places=2)
    air_quality_status = models.CharField(max_length=100)
    water_safety_status = models.CharField(max_length=100)
    healthcare_capacity = models.CharField(max_length=100)
    emergency_response_time = models.CharField(max_length=50)
    medicine_availability = models.CharField(max_length=100)
    special_programs = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_updated']
        unique_together = ['city', 'season']

    def __str__(self):
        return f"{self.city.name} - {self.season.name} Health Metrics"
