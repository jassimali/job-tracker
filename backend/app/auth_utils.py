import os

from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer

from app.database import get_connection

import jwt

from dotenv import load_dotenv
from pwdlib import PasswordHash


load_dotenv()

security = HTTPBearer()

password_hash = PasswordHash.recommended()


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256",
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60",
    )
)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        user_id = int(payload["sub"])

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
        KeyError,
        ValueError,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, name, email
        FROM users
        WHERE id = %s
        """,
        (user_id,),
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return {
        "id": user[0],
        "name": user[1],
        "email": user[2],
    }


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(user_id: int) -> str:
    expiration = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expiration,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token