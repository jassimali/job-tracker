from fastapi import APIRouter,Depends, HTTPException

from app.database import get_connection
from app.schemas import Application

from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)
def row_to_application(row):
    return {
        "id": row[0],
        "company": row[1],
        "role": row[2],
        "status": row[3],
    }


@router.post("")
def create_application(
    application: Application,
    current_user=Depends(get_current_user),
):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO applications (
            company,
            role,
            status,
            user_id
        )
        VALUES (%s, %s, %s, %s)
        RETURNING id, company, role, status
        """,
        (
            application.company,
            application.role,
            application.status,
            current_user["id"],
        ),
    )

    new_application = cursor.fetchone()

    cursor.execute(
        """
        INSERT INTO application_status_history (
            application_id,
            status
        )
        VALUES (%s, %s)
        """,
        (
            new_application[0],
            application.status,
        ),
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Application added successfully",
        "application": row_to_application(
            new_application
        ),
    }


@router.get("")
def get_applications(

    current_user=Depends(get_current_user),
    ):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
    """
    SELECT id, company, role, status
    FROM applications
    WHERE user_id = %s
    ORDER BY id;
    """,
    (current_user["id"],),
)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    applications = [
    row_to_application(row)
    for row in rows
]

    return {
        "applications": applications
    }

@router.get("/{application_id}")
def get_application(
    application_id: int,
    current_user=Depends(get_current_user),
):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, company, role, status
        FROM applications
        WHERE id = %s
        AND user_id = %s
        """,
        (
            application_id,
            current_user["id"],
        ),
    )

    application = cursor.fetchone()

    cursor.close()
    connection.close()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return {
        "application": row_to_application(
            application
        )
    }


@router.put("/{application_id}")
def update_application(
    application_id: int,
    updated_application: Application,
    current_user=Depends(get_current_user),
):
    connection = get_connection()
    cursor = connection.cursor()

    # Get current status and verify ownership
    cursor.execute(
        """
        SELECT status
        FROM applications
        WHERE id = %s
        AND user_id = %s
        """,
        (
            application_id,
            current_user["id"],
        ),
    )

    existing_application = cursor.fetchone()

    if existing_application is None:
        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    old_status = existing_application[0]

    # Update only the authenticated user's application
    cursor.execute(
        """
        UPDATE applications
        SET company = %s,
            role = %s,
            status = %s
        WHERE id = %s
        AND user_id = %s
        RETURNING id, company, role, status
        """,
        (
            updated_application.company,
            updated_application.role,
            updated_application.status,
            application_id,
            current_user["id"],
        ),
    )

    application = cursor.fetchone()

    # Add history only when status changes
    if old_status != updated_application.status:
        cursor.execute(
            """
            INSERT INTO application_status_history (
                application_id,
                status
            )
            VALUES (%s, %s)
            """,
            (
                application_id,
                updated_application.status,
            ),
        )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Application updated successfully",
        "application": row_to_application(
            application
        ),
    }


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    current_user=Depends(get_current_user),
):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM applications
        WHERE id = %s
        AND user_id = %s
        RETURNING id, company, role, status
        """,
        (
            application_id,
            current_user["id"],
        ),
    )

    deleted_application = cursor.fetchone()

    if deleted_application is None:
        connection.rollback()

        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Application deleted successfully",
        "application": row_to_application(
            deleted_application
        ),
    }

@router.get("/{application_id}/history")
def get_application_history(
    application_id: int,
    current_user=Depends(get_current_user),
):
    connection = get_connection()
    cursor = connection.cursor()

    # Verify that the application belongs to current user
    cursor.execute(
        """
        SELECT id
        FROM applications
        WHERE id = %s
        AND user_id = %s
        """,
        (
            application_id,
            current_user["id"],
        ),
    )

    application = cursor.fetchone()

    if application is None:
        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    cursor.execute(
        """
        SELECT
            id,
            application_id,
            status,
            changed_at
        FROM application_status_history
        WHERE application_id = %s
        ORDER BY changed_at ASC
        """,
        (application_id,),
    )

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    history = [
        {
            "id": row[0],
            "application_id": row[1],
            "status": row[2],
            "changed_at": row[3],
        }
        for row in rows
    ]

    return {
        "history": history
    }