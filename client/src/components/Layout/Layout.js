import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="layout">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <main className="layout__content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
