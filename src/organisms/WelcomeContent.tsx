import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import WelcomeHeader from "../molecules/WelcomeHeader";
import UserRegistrationForm from "../molecules/UserRegistrationForm";
import { Button } from "../atoms/Button";
import { User } from "../store/userStore";

interface WelcomeContentProps {
  onRegister: (userData: User) => void;
  className?: string;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({
  onRegister,
  className = "",
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  const handleStartClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (userData: User) => {
    onRegister(userData);
  };

  return (
    <div className={`w-full max-w-md mx-auto px-4 ${className}`}>
      {!showForm ? (
        <>
          <WelcomeHeader className="mb-8" />
          <div className="text-center">
            <Button size="lg" icon={<ArrowRight />} onClick={handleStartClick}>
              {t("letsStart")}
            </Button>
          </div>
        </>
      ) : (
        <div className="transition-all duration-300 animate-fade-in">
          <UserRegistrationForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default WelcomeContent;
