from fastapi import APIRouter, Depends
from app.auth_utils import get_current_user
from app.database import get_connection


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/funnel")
def get_funnel_analytics(current_user=Depends(get_current_user)):
    
    connection = get_connection()
    cursor = connection.cursor()

    # Total number of applications
    cursor.execute(
    """
    SELECT COUNT(*)
    FROM applications
    WHERE user_id = %s
    """,
    (current_user["id"],),
)

    total_applications = cursor.fetchone()[0]


    # Applications that ever reached Interview
    cursor.execute(
    """
    SELECT COUNT(DISTINCT h.application_id)
    FROM application_status_history h
    JOIN applications a
        ON h.application_id = a.id
    WHERE h.status = 'Interview'
    AND a.user_id = %s
    """,
    (current_user["id"],),
)

    reached_interview = cursor.fetchone()[0]


    # Applications that ever reached Selected
    cursor.execute(
    """
    SELECT COUNT(DISTINCT h.application_id)
    FROM application_status_history h
    JOIN applications a
        ON h.application_id = a.id
    WHERE h.status = 'Selected'
    AND a.user_id = %s
    """,
    (current_user["id"],),
)

    reached_selected = cursor.fetchone()[0]


    cursor.close()
    connection.close()


    interview_rate = (
        round(
            reached_interview
            / total_applications
            * 100,
            1,
        )
        if total_applications > 0
        else 0
    )


    selection_rate = (
        round(
            reached_selected
            / total_applications
            * 100,
            1,
        )
        if total_applications > 0
        else 0
    )


    interview_to_selection_rate = (
        round(
            reached_selected
            / reached_interview
            * 100,
            1,
        )
        if reached_interview > 0
        else 0
    )


    return {
        "total_applications": total_applications,
        "reached_interview": reached_interview,
        "reached_selected": reached_selected,
        "interview_rate": interview_rate,
        "selection_rate": selection_rate,
        "interview_to_selection_rate":
            interview_to_selection_rate,
    }