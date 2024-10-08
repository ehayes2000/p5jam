import { createContext, useState } from 'react';

type PopupState = 'join' | 'create' | 'closed';

interface TPopupContext {
  popup: PopupState;
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>;
}

export const PopupContext = createContext<TPopupContext>({
  popup: 'closed',
  setPopup: () => {},
});

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [popup, setPopup] = useState<PopupState>('closed');
  return (
    <PopupContext.Provider value={{ popup, setPopup }}>
      {children}
    </PopupContext.Provider>
  );
};
