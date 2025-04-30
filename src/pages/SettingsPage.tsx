import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useTaskStore } from "../store/taskStore";
import HeaderBar from "../molecules/HeaderBar";
import PhotoUpload from "../atoms/PhotoUpload";
import BottomNavigation from "../molecules/BottomNavigation";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user, updateUser, clearUser } = useUserStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle profile update
  const handleProfileUpdate = () => {
    if (firstName.trim() === "") {
      setSnackbarMessage(t("firstNameRequired"));
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
      return;
    }

    if (lastName.trim() === "") {
      setSnackbarMessage(t("lastNameRequired"));
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
      return;
    }

    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    setSnackbarMessage(t("profileUpdated"));
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  // Handle photo change
  const handlePhotoChange = (photoBase64: string | null) => {
    // The PhotoUpload component already updates the user store
    setSnackbarMessage(photoBase64 ? t("photoUpdated") : t("photoRemoved"));
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  // Handle logout
  const handleLogout = () => {
    clearUser();
    navigate("/welcome");
  };

  // Handle data reset
  const handleResetData = () => {
    // Clear all app data
    clearUser();
    useTaskStore.getState().resetAllData();
    localStorage.clear();
    navigate("/welcome");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <HeaderBar title={t("settings")} />

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("profileSettings")}
          </h2>

          <div className="flex flex-col items-center mb-6">
            <PhotoUpload
              value={user?.photo || null}
              onChange={handlePhotoChange}
              className="mb-4"
            />

            <div className="text-center">
              <h3 className="font-medium text-lg">
                {user?.firstName} {user?.lastName}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("firstName")}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("firstName")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("lastName")}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("lastName")}
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t("saveChanges")}
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("dataManagement")}
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowConfirmLogout(true)}
              className="w-full bg-orange-100 text-orange-800 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t("logout")}
            </button>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full bg-red-100 text-red-800 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t("resetAllData")}
            </button>
          </div>
        </div>

        {/* App Info Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("appInfo")}
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("version")}</span>
              <span className="font-medium">1.0.0</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("lastUpdate")}</span>
              <span className="font-medium">2025-04-30</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("dataStoredLocally")}</span>
              <span className="font-medium">{t("yes")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Logout Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">{t("confirmLogout")}</h3>
            <p className="text-gray-600 mb-4">{t("logoutConfirmMessage")}</p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">{t("confirmReset")}</h3>
            <p className="text-gray-600 mb-4">{t("resetConfirmMessage")}</p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                {t("resetAllData")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50">
          {snackbarMessage}
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
