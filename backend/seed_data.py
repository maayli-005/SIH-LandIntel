from app.database import SessionLocal
from app.models import LandRecord

db = SessionLocal()

sample_records = [
    LandRecord(state="Gujarat", district="Ahmedabad", land_type="Urban", area_hectares=850.5, dispute_status="Clear", latitude=23.0225, longitude=72.5714),
    LandRecord(state="Maharashtra", district="Pune", land_type="Agricultural", area_hectares=1500.0, dispute_status="Clear", latitude=18.5204, longitude=73.8567),
    LandRecord(state="Rajasthan", district="Jaipur", land_type="Rural", area_hectares=2200.75, dispute_status="Disputed", latitude=26.9124, longitude=75.7873),
    LandRecord(state="Uttar Pradesh", district="Lucknow", land_type="Urban", area_hectares=600.0, dispute_status="Clear", latitude=26.8467, longitude=80.9462),
    LandRecord(state="Karnataka", district="Bengaluru", land_type="Urban", area_hectares=950.25, dispute_status="Disputed", latitude=12.9716, longitude=77.5946),
    LandRecord(state="Tamil Nadu", district="Chennai", land_type="Forest", area_hectares=3000.0, dispute_status="Clear", latitude=13.0827, longitude=80.2707),
    LandRecord(state="West Bengal", district="Kolkata", land_type="Agricultural", area_hectares=1750.5, dispute_status="Clear", latitude=22.5726, longitude=88.3639),
    LandRecord(state="Madhya Pradesh", district="Bhopal", land_type="Rural", area_hectares=2800.0, dispute_status="Disputed", latitude=23.2599, longitude=77.4126),
    LandRecord(state="Punjab", district="Ludhiana", land_type="Agricultural", area_hectares=1300.0, dispute_status="Clear", latitude=30.9010, longitude=75.8573),
    LandRecord(state="Kerala", district="Kochi", land_type="Urban", area_hectares=450.0, dispute_status="Clear", latitude=9.9312, longitude=76.2673),
]

db.add_all(sample_records)
db.commit()
db.close()

print(f"Inserted {len(sample_records)} sample land records successfully.")