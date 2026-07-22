from fastapi import APIRouter, Depends

from app.controllers.admin_controller import get_admin_dashboard_metrics
from app.dependencies.auth import get_current_admin
from app.models.dashboard import DashboardStats

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard", response_model=DashboardStats)
async def read_dashboard(admin=Depends(get_current_admin)):
    return await get_admin_dashboard_metrics()
