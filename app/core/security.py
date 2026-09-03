from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
import hashlib

SECRET_KEY = "AUTOCRE_DMS_PRODUCTION_SECRET_KEY_REPLACE_ME"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # مقارنة الهاش المباشر لضمان العمل بدون أي مشاكل بيئية
    return get_password_hash(plain_password) == hashed_password

def get_password_hash(password: str) -> str:
    # استخدام SHA256 مع Secret Salt قوي وسريع وثابت
    salt = "autocore_dms_salt_"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)