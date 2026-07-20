import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProfileSetupStep from "../components/onboarding/steps/ProfileSetupStep";
import ResumeUploadStep from "../components/onboarding/steps/ResumeUploadStep";
import ConnectAccountsStep from "../components/onboarding/steps/ConnectAccountsStep";
import TargetRoleStep from "../components/onboarding/steps/TargetRoleStep";
import CompletedStep from "../components/onboarding/steps/CompletedStep";

export default function Onboarding() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [globalData, setGlobalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepSave = (stepData) => {
    setGlobalData((prev) => ({ ...prev, ...stepData }));
  };

  const submitFinalData = async (finalData) => {
    const completeData = { ...globalData, ...finalData };
    setIsSubmitting(true);
    const toastId = toast.loading("Saving your profile...");
    
    try {
      await axios.post("http://localhost:5000/api/profile/save", {
        userId: user?.id,
        fullName: completeData.fullName,
        currentRole: completeData.experience,
        targetRole: completeData.targetRole,
        yearsExperience: completeData.experience === "fresher" ? 0 : completeData.experience === "junior" ? 2 : 5,
        githubUrl: completeData.githubUrl,
        linkedinUrl: completeData.linkedinUrl
      });
      
      toast.success("Profile saved successfully!", { id: toastId });
      setCurrentStep(4);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSetupStep onNext={nextStep} onPrev={prevStep} onSave={handleStepSave} />;
      case 2:
        return <ConnectAccountsStep onNext={nextStep} onPrev={prevStep} onSave={handleStepSave} />;
      case 3:
        return <TargetRoleStep onNext={(data) => {
          handleStepSave(data);
          submitFinalData(data);
        }} onPrev={prevStep} isSubmitting={isSubmitting} />;
      case 4:
        return <ResumeUploadStep onNext={nextStep} onPrev={prevStep} globalData={globalData} />;
      case 5:
        return <CompletedStep />;
      default:
        return <ProfileSetupStep onNext={nextStep} onPrev={prevStep} onSave={handleStepSave} />;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      {renderStep()}
    </OnboardingLayout>
  );
}
