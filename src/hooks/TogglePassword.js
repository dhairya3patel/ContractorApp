import React, { useState } from "react";

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('Show');
  
    const handlePasswordVisibility = () => {
      if (rightIcon === 'Show') {
        setRightIcon('Hide');
        setPasswordVisibility(!passwordVisibility);
      } else if (rightIcon === 'Hide') {
        setRightIcon('Show');
        setPasswordVisibility(!passwordVisibility);
      }
    };
    return {
      passwordVisibility,
      rightIcon,
      handlePasswordVisibility
    };
  };