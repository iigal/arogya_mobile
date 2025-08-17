# E-Arogya Disease Dashboard Backend

Django REST API backend for the E-Arogya Disease Dashboard mobile application.

## Features

- **City-specific health data** - Get health information tailored to specific cities and seasons
- **Disease management** - Track diseases, symptoms, treatments, and outbreaks
- **Hospital directory** - Comprehensive hospital and medical facility information
- **Vaccination data** - Vaccine information and vaccination center locations
- **Health metrics** - City-wise health statistics and metrics
- **REST API** - Full RESTful API with filtering and pagination

## Tech Stack

- **Django 4.2.7** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database
- **django-cors-headers** - CORS handling for mobile app
- **django-filter** - API filtering capabilities

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database setup**
   - Create PostgreSQL database named `earogya_db`
   - Copy `.env.example` to `.env` and update database credentials:
   ```bash
   copy .env.example .env
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Populate sample data**
   ```bash
   python manage.py populate_sample_data
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Cities
- `GET /api/cities/` - List all cities
- `GET /api/cities/{name}/` - Get city details with health data

### Health Data (City-specific)
- `GET /api/cities/{city_name}/symptoms/?season={season}` - City symptoms by season
- `GET /api/cities/{city_name}/preventive-measures/?season={season}` - Preventive measures
- `GET /api/cities/{city_name}/treatment-guidelines/?season={season}` - Treatment guidelines
- `GET /api/cities/{city_name}/hospitals/` - City hospitals
- `GET /api/cities/{city_name}/vaccination-centers/` - Vaccination centers
- `GET /api/cities/{city_name}/health-metrics/?season={season}` - Health metrics

### Diseases & Outbreaks
- `GET /api/diseases/` - List all diseases
- `GET /api/active-diseases/` - Current disease outbreaks

### General Endpoints
- `GET /api/hospitals/` - All hospitals
- `GET /api/vaccines/` - Available vaccines
- `GET /api/prevention-tips/` - General prevention tips
- `GET /api/treatment-guidelines/` - General treatment guidelines
- `GET /api/dashboard-summary/` - Dashboard summary data

### Query Parameters

Most endpoints support filtering:
- `?season=monsoon|summer|winter` - Filter by season
- `?city=CityName` - Filter by city
- `?category=CategoryName` - Filter by category
- `?priority=low|medium|high|critical` - Filter by priority

## Database Models

### Core Models
- **City** - Cities in Nepal with location and basic info
- **Season** - Seasonal data (Monsoon, Summer, Winter)
- **Disease** - Disease information and categories

### Health Data Models
- **Symptom** - Disease symptoms by city and season
- **PreventiveMeasure** - Prevention measures by city and season
- **TreatmentGuideline** - Treatment protocols by city and season
- **DiseaseOutbreak** - Current outbreak data and statistics

### Medical Facilities
- **Hospital** - Hospital directory with specialties and ratings
- **VaccinationCenter** - Vaccination centers and available vaccines
- **Vaccine** - Vaccine information and effectiveness

### Metrics
- **CityHealthMetrics** - City health statistics and indicators

## Sample Data

The `populate_sample_data` management command creates:
- 5 cities (Kathmandu, Pokhara, Chitwan, Dharan, Butwal)
- 3 seasons with health data
- 5 common diseases with symptoms and treatments
- Hospital and vaccination center data
- Disease outbreak information
- City health metrics

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Manage all health data
- Add/edit cities, diseases, hospitals
- Monitor disease outbreaks
- Update health metrics

## Integration with Mobile App

The API is designed to work with the React Native Expo mobile app:
- CORS configured for mobile development
- JSON responses optimized for mobile consumption
- Filtering and pagination for efficient data loading
- City and season-based data organization

## Environment Variables

Create a `.env` file with:
```
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=earogya_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

## Development

- Models are in `health_data/models.py`
- API views in `health_data/views.py`
- URL routing in `health_data/urls.py`
- Admin configuration in `health_data/admin.py`
- Serializers in `health_data/serializers.py`

## Production Deployment

For production:
1. Set `DEBUG=False`
2. Configure proper `SECRET_KEY`
3. Set up production PostgreSQL database
4. Configure proper `ALLOWED_HOSTS`
5. Set up static file serving
6. Use production WSGI server (gunicorn, etc.)

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## License

This project is part of the E-Arogya Disease Dashboard application.
