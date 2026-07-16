import { useState } from "react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProfileSetupStep from "../components/onboarding/steps/ProfileSetupStep";
import ResumeUploadStep from "../components/onboarding/steps/ResumeUploadStep";
import ConnectAccountsStep from "../components/onboarding/steps/ConnectAccountsStep";
import TargetRoleStep from "../components/onboarding/steps/TargetRoleStep";
import CompletedStep from "../components/onboarding/steps/CompletedStep";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSetupStep onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <ResumeUploadStep onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <ConnectAccountsStep onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <TargetRoleStep onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <CompletedStep />;
      default:
        return <ProfileSetupStep onNext={nextStep} onPrev={prevStep} />;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      {renderStep()}
    </OnboardingLayout>
  );
}
