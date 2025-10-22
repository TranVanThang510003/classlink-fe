'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { App } from 'antd';

const MessageContext = createContext<any>(null);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
    const { message } = App.useApp();

    return (
        <MessageContext.Provider value={message}>
            {children}
        </MessageContext.Provider>
    );
};

// Custom hook
export const useMessage = () => {
    const ctx = useContext(MessageContext);
    if (!ctx) throw new Error('useMessage must be used within <MessageProvider>');
    return ctx;
};
