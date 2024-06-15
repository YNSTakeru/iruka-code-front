'use client';

import { useEffect, useState } from 'react';
import { CoverImageModal } from '../modals/cover-image-model';
import { SettingsModal } from '../modals/settings-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};
