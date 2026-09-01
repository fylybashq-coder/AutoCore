from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    @staticmethod
    def get_dashboard(db):
        return DashboardRepository.get_dashboard(db)