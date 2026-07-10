from fastapi import APIRouter, HTTPException

from app.auth_utils import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_connection
from app.schemas import (
    UserLogin,
    UserRegister,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register_user(user: UserRegister):
    connection = get_connection()
    cursor = connection.cursor()

    # Check whether the email is already registered
    cursor.execute(
        """
        SELECT id
        FROM users
        WHERE email = %s
        """,
        (user.email,),
    )

    existing_user = cursor.fetchone()

    if existing_user is not None:
        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    # Hash the password before storing it
    hashed_password = hash_password(
        user.password
    )

    # Create the user
    cursor.execute(
        """
        INSERT INTO users (
            name,
            email,
            password_hash
        )
        VALUES (%s, %s, %s)
        RETURNING id, name, email, created_at
        """,
        (
            user.name,
            user.email,
            hashed_password,
        ),
    )

    new_user = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user[0],
            "name": new_user[1],
            "email": new_user[2],
            "created_at": new_user[3],
        },
    }
@router.post("/login")
def login_user(login_data: UserLogin):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            password_hash
        FROM users
        WHERE email = %s
        """,
        (login_data.email,),
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    password_is_valid = verify_password(
        login_data.password,
        user[3],
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        user[0]
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
        },
    }