import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Input from "../atoms/Input";
import { Button } from "../atoms/Button";
import PhotoUpload from "../atoms/PhotoUpload";
import { User } from "../store/userStore";

interface UserRegistrationFormProps {
  onSubmit: (userData: User) => void;
  className?: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  onSubmit,
  className = "",
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    photo: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (photoBase64: string | null) => {
    setFormData((prev) => ({ ...prev, photo: photoBase64 || undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("lastNameRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Submit the form data
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex flex-col items-center mb-6">
        <PhotoUpload value={formData.photo} onChange={handlePhotoChange} />
      </div>

      <Input
        id="firstName"
        name="firstName"
        label={t("firstName")}
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        required
        disabled={isSubmitting}
      />

      <Input
        id="lastName"
        name="lastName"
        label={t("lastName")}
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        required
        disabled={isSubmitting}
      />

      <div className="mt-8">
        <Button
          type="submit"
          fullWidth
          icon={<ArrowRight size={18} />}
          disabled={isSubmitting}
        >
          {t("saveProfile")}
        </Button>
      </div>
    </form>
  );
};

export default UserRegistrationForm;
