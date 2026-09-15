import os
import hmac
import hashlib
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from backend.app.config import settings

ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2-HMAC-SHA256 with a 16-byte cryptographic salt.
    Returns: 'salt_hex$hash_hex'
    """
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}${pw_hash.hex()}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """
    Verifies a plain-text password against a stored 'salt_hex$hash_hex'.
    Constant-time comparison prevents timing attacks.
    """
    try:
        salt_hex, hash_hex = stored_hash.split("$", 1)
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)
        actual_hash = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT access token with expiration and claims.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"iat": now, "exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and verifies a signed JWT token.
    Returns payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
