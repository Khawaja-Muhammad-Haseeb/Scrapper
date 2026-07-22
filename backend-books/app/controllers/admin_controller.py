from app.services.admin_service import fetch_dashboard_stats


async def get_admin_dashboard_metrics():
    return await fetch_dashboard_stats()
