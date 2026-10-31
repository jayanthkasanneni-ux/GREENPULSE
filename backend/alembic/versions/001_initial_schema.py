"""Initial GREENPULSE database schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-31 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('phone_number', sa.String(length=30), nullable=True),
        sa.Column('preferred_language', sa.String(length=50), server_default='English', nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. Farms
    op.create_table(
        'farms',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('farm_name', sa.String(length=150), server_default='My Farm', nullable=True),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('district', sa.String(length=100), nullable=False),
        sa.Column('village', sa.String(length=100), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('land_area', sa.Float(), nullable=False),
        sa.Column('growing_season', sa.String(length=50), server_default='Kharif', nullable=False),
        sa.Column('irrigation_availability', sa.String(length=50), server_default='rainfed', nullable=False),
        sa.Column('water_availability', sa.String(length=100), server_default='moderate', nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farms_id'), 'farms', ['id'], unique=False)
    op.create_index(op.f('ix_farms_user_id'), 'farms', ['user_id'], unique=False)
    op.create_index(op.f('ix_farms_district'), 'farms', ['district'], unique=False)
    op.create_index(op.f('ix_farms_state'), 'farms', ['state'], unique=False)

    # 3. Soil Profiles
    op.create_table(
        'soil_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('farm_id', sa.Integer(), nullable=False),
        sa.Column('soil_knowledge_level', sa.String(length=50), server_default='unknown', nullable=True),
        sa.Column('soil_type', sa.String(length=50), nullable=True),
        sa.Column('soil_ph', sa.Float(), nullable=True),
        sa.Column('nitrogen', sa.Float(), nullable=True),
        sa.Column('phosphorus', sa.Float(), nullable=True),
        sa.Column('potassium', sa.Float(), nullable=True),
        sa.Column('organic_carbon', sa.Float(), nullable=True),
        sa.Column('soil_data_source', sa.String(length=100), server_default='Unknown', nullable=True),
        sa.Column('measurement_date', sa.Date(), nullable=True),
        sa.Column('verification_status', sa.String(length=50), server_default='unknown', nullable=True),
        sa.Column('lab_name', sa.String(length=150), nullable=True),
        sa.Column('soil_card_number', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('farm_id')
    )
    op.create_index(op.f('ix_soil_profiles_id'), 'soil_profiles', ['id'], unique=False)

    # 4. Weather Records
    op.create_table(
        'weather_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('farm_id', sa.Integer(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('observation_date', sa.Date(), nullable=False),
        sa.Column('rainfall_mm', sa.Float(), server_default='0.0', nullable=True),
        sa.Column('temp_min_c', sa.Float(), nullable=True),
        sa.Column('temp_max_c', sa.Float(), nullable=True),
        sa.Column('temp_avg_c', sa.Float(), nullable=True),
        sa.Column('data_source', sa.String(length=100), server_default='Open-Meteo', nullable=True),
        sa.Column('is_forecast', sa.Boolean(), server_default='false', nullable=True),
        sa.Column('is_demo', sa.Boolean(), server_default='false', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_weather_records_id'), 'weather_records', ['id'], unique=False)
    op.create_index(op.f('ix_weather_records_farm_id'), 'weather_records', ['farm_id'], unique=False)
    op.create_index(op.f('ix_weather_records_observation_date'), 'weather_records', ['observation_date'], unique=False)

    # 5. Crop Database
    op.create_table(
        'crops',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('crop_code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('botanical_name', sa.String(length=100), nullable=True),
        sa.Column('local_name', sa.String(length=100), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('image', sa.String(length=255), nullable=True),
        sa.Column('suitable_soil_types', sa.JSON(), nullable=False),
        sa.Column('preferred_ph_min', sa.Float(), nullable=False),
        sa.Column('preferred_ph_max', sa.Float(), nullable=False),
        sa.Column('rainfall_min_mm', sa.Float(), nullable=False),
        sa.Column('rainfall_max_mm', sa.Float(), nullable=False),
        sa.Column('temp_min_c', sa.Float(), nullable=False),
        sa.Column('temp_max_c', sa.Float(), nullable=False),
        sa.Column('water_demand', sa.String(length=50), nullable=False),
        sa.Column('growing_duration_days', sa.String(length=50), nullable=False),
        sa.Column('growing_duration_min_days', sa.Integer(), nullable=True),
        sa.Column('growing_duration_max_days', sa.Integer(), nullable=True),
        sa.Column('drought_sensitivity', sa.String(length=50), nullable=False),
        sa.Column('heat_sensitivity', sa.String(length=50), nullable=False),
        sa.Column('excess_rainfall_sensitivity', sa.String(length=50), nullable=False),
        sa.Column('recommended_growing_seasons', sa.JSON(), nullable=False),
        sa.Column('soil_compatibility_text', sa.String(length=255), nullable=True),
        sa.Column('estimated_yield_range', sa.String(length=100), nullable=True),
        sa.Column('reasons_default', sa.JSON(), nullable=True),
        sa.Column('climate_risks', sa.JSON(), nullable=True),
        sa.Column('agronomic_advisory', sa.JSON(), nullable=True),
        sa.Column('economics', sa.JSON(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('is_demo', sa.Boolean(), server_default='false', nullable=True),
        sa.Column('source_reference', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_crops_id'), 'crops', ['id'], unique=False)
    op.create_index(op.f('ix_crops_crop_code'), 'crops', ['crop_code'], unique=True)
    op.create_index(op.f('ix_crops_name'), 'crops', ['name'], unique=False)

    # 6. Recommendations
    op.create_table(
        'recommendations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('farm_id', sa.Integer(), nullable=False),
        sa.Column('selected_season', sa.String(length=50), nullable=False),
        sa.Column('recommended_crops', sa.JSON(), nullable=False),
        sa.Column('suitability_scores', sa.JSON(), nullable=False),
        sa.Column('risk_assessments', sa.JSON(), nullable=False),
        sa.Column('data_quality_info', sa.JSON(), nullable=False),
        sa.Column('recommendation_explanation', sa.String(length=1000), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_recommendations_id'), 'recommendations', ['id'], unique=False)
    op.create_index(op.f('ix_recommendations_farm_id'), 'recommendations', ['farm_id'], unique=False)

    # 7. Agronomic Guides
    op.create_table(
        'agronomic_guides',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('guide_code', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('applicable_crops', sa.JSON(), nullable=False),
        sa.Column('applicable_region', sa.String(length=150), nullable=True),
        sa.Column('summary', sa.String(length=1000), nullable=False),
        sa.Column('key_practices', sa.JSON(), nullable=False),
        sa.Column('source_organisation', sa.String(length=150), nullable=False),
        sa.Column('reference_title', sa.String(length=255), nullable=False),
        sa.Column('source_url', sa.String(length=255), nullable=True),
        sa.Column('publication_date', sa.String(length=50), nullable=True),
        sa.Column('is_verified', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agronomic_guides_id'), 'agronomic_guides', ['id'], unique=False)
    op.create_index(op.f('ix_agronomic_guides_guide_code'), 'agronomic_guides', ['guide_code'], unique=True)


def downgrade() -> None:
    op.drop_table('agronomic_guides')
    op.drop_table('recommendations')
    op.drop_table('crops')
    op.drop_table('weather_records')
    op.drop_table('soil_profiles')
    op.drop_table('farms')
    op.drop_table('users')

