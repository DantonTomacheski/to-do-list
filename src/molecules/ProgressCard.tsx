import React from "react";
import { useTranslation } from "react-i18next";
import ProgressCircle from "../atoms/ProgressCircle";

interface ProgressCardProps {
  percentage: number;
  completed?: number;
  total?: number;
}

import { useNavigate } from "react-router-dom";

const ProgressCard: React.FC<ProgressCardProps> = ({ percentage, completed, total }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Obter data de hoje no formato yyyy-MM-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  return (
    <div className="bg-purple-600 p-4 rounded-xl text-white relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="z-10">
          <p className="text-white/90 mb-1">{t("todaysTaskProgress")}</p>
          {completed !== undefined && total !== undefined && (
            <p className="text-white/80 text-sm">
              {completed} / {total} {t("tasks")}
            </p>
          )}
          <button
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg mt-4 hover:bg-white/30 transition-all duration-200"
            onClick={() => navigate(`/calendar?date=${todayStr}`)}
          >
            {t("viewTask")}
          </button>
        </div>
        <div className="z-10">
          <ProgressCircle
            percentage={percentage}
            color="#FFFFFF"
            textColor="#FFFFFF"
            trailColor="rgba(255, 255, 255, 0.3)"
            size="md"
          />
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-700 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
    </div>
  );
};

export default ProgressCard;
