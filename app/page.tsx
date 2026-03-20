import React, { useState } from 'react';

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Step 1: Choose Template', 'Step 2: Customize Content', 'Step 3: Review and Generate'];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <h1>Carousel Generation Process</h1>
      <div>
        <h2>{steps[currentStep]}</h2>
        <div>
          <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
          <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</button>
        </div>
        <div>
          {steps.map((step, index) => (
            <span key={index} style={{ margin: '0 4px', fontWeight: currentStep === index ? 'bold' : 'normal' }}>
              {index + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;