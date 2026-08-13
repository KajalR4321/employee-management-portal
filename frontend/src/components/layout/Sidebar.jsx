import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
    const { user } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            roles: ['ADMIN', 'EMPLOYEE']
        },
        {
            id: 'departments',
            label: 'Departments',
            icon: '🏢',
            roles: ['ADMIN']
        },
        {
            id: 'employees',
            label: 'Employee Directory',
            icon: '👥',
            roles: ['ADMIN']
        },
        {
            id: 'requests',
            label: 'Leave Portal',
            icon: '🌴',
            roles: ['ADMIN', 'EMPLOYEE']
        }
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* =====================================================
                MOBILE MENU BUTTON
            ====================================================== */}
            <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="
                    md:hidden
                    fixed
                    top-4
                    left-4
                    z-[60]

                    w-10
                    h-10

                    flex
                    items-center
                    justify-center

                    rounded-xl

                    bg-slate-900
                    text-white

                    shadow-lg
                    border
                    border-slate-700

                    active:scale-90

                    transition-all
                    duration-200

                    hover:bg-slate-800
                "
                aria-label="Open menu"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* =====================================================
                MOBILE BACKDROP
            ====================================================== */}
            <div
                className={`
                    fixed
                    inset-0
                    z-[70]

                    bg-slate-950/60
                    backdrop-blur-sm

                    md:hidden

                    transition-all
                    duration-500

                    ${
                        isMobileOpen
                            ? 'opacity-100 visible'
                            : 'opacity-0 invisible'
                    }
                `}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* =====================================================
                SIDEBAR
            ====================================================== */}
            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    bottom-0

                    z-[80]

                    flex
                    flex-col
                    justify-between

                    p-4

                    bg-slate-900
                    text-slate-300

                    border-r
                    border-slate-800

                    shadow-2xl

                    w-64

                    transform

                    transition-all
                    duration-500

                    ease-[cubic-bezier(0.16,1,0.3,1)]

                    ${
                        isMobileOpen
                            ? 'translate-x-0 opacity-100 scale-100'
                            : '-translate-x-full opacity-0 scale-[0.98]'
                    }

                    md:relative
                    md:min-h-screen
                    md:shadow-none

                    md:translate-x-0
                    md:opacity-100
                    md:scale-100

                    ${
                        isCollapsed
                            ? 'md:w-20'
                            : 'md:w-64'
                    }
                `}
            >

                {/* =================================================
                    DESKTOP COLLAPSE BUTTON
                ================================================== */}
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="
                        hidden
                        md:flex

                        absolute

                        -right-3
                        top-7

                        w-7
                        h-7

                        rounded-full

                        bg-indigo-600
                        hover:bg-indigo-500

                        text-white

                        items-center
                        justify-center

                        text-xs

                        shadow-lg

                        border-2
                        border-slate-900

                        z-30

                        transition-all
                        duration-200

                        hover:scale-110
                        active:scale-95
                    "
                    title={
                        isCollapsed
                            ? 'Expand Sidebar'
                            : 'Collapse Sidebar'
                    }
                >
                    <span
                        className={`
                            transition-transform
                            duration-300

                            ${
                                isCollapsed
                                    ? 'rotate-180'
                                    : ''
                            }
                        `}
                    >
                        ◀
                    </span>
                </button>

                {/* =================================================
                    TOP SECTION
                ================================================== */}
                <div className="space-y-6">

                    {/* =================================================
                        LOGO
                    ================================================== */}
                    <div
                        className={`
                            flex
                            items-center
                            justify-between

                            px-2
                            py-2

                            border-b
                            border-slate-800

                            transition-all
                            duration-500
                            delay-75

                            ${
                                isMobileOpen
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-5'
                            }

                            md:opacity-100
                            md:translate-x-0
                        `}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">

                            {/* LOGO ICON */}
                            <div
                                className="
                                    relative

                                    w-10
                                    h-10
                                    shrink-0

                                    rounded-2xl

                                    bg-gradient-to-tr
                                    from-indigo-600
                                    via-indigo-500
                                    to-violet-500

                                    flex
                                    items-center
                                    justify-center

                                    shadow-lg

                                    transition-transform
                                    duration-500

                                    hover:rotate-6
                                    hover:scale-105
                                "
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>

                                <span
                                    className="
                                        absolute

                                        -bottom-0.5
                                        -right-0.5

                                        w-3
                                        h-3

                                        bg-emerald-400

                                        border-2
                                        border-slate-900

                                        rounded-full
                                    "
                                />
                            </div>

                            {/* LOGO TEXT */}
                            <div
                                className={`
                                    whitespace-nowrap

                                    transition-all
                                    duration-300

                                    ${
                                        isCollapsed
                                            ? 'md:opacity-0 md:w-0 md:overflow-hidden'
                                            : 'opacity-100'
                                    }
                                `}
                            >
                                <h1 className="font-extrabold text-white text-base">
                                    APEX
                                    <span className="text-indigo-400">
                                        CORP
                                    </span>
                                </h1>

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        text-slate-400
                                        tracking-wider
                                        uppercase
                                        mt-1
                                    "
                                >
                                    Workforce OS
                                </p>
                            </div>
                        </div>

                        {/* =================================================
                            MOBILE CLOSE BUTTON
                        ================================================== */}
                        <button
                            type="button"
                            onClick={() => setIsMobileOpen(false)}
                            className="
                                md:hidden

                                w-8
                                h-8

                                rounded-lg

                                text-slate-400

                                hover:text-white
                                hover:bg-slate-800

                                transition-all
                                duration-200

                                hover:rotate-90
                                active:scale-90
                            "
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    {/* =================================================
                        NAVIGATION
                    ================================================== */}
                    <nav className="space-y-1.5">

                        {navItems.map((item, index) => {

                            if (!item.roles.includes(user?.role)) {
                                return null;
                            }

                            const isActive =
                                activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        handleNavClick(item.id)
                                    }
                                    style={{
                                        transitionDelay:
                                            isMobileOpen
                                                ? `${100 + index * 70}ms`
                                                : '0ms'
                                    }}
                                    className={`
                                        group
                                        relative

                                        w-full

                                        flex
                                        items-center

                                        px-3.5
                                        py-3

                                        rounded-2xl

                                        text-sm

                                        transition-all
                                        duration-300

                                        hover:translate-x-1

                                        ${
                                            isActive
                                                ? `
                                                    bg-indigo-600
                                                    text-white
                                                    shadow-lg
                                                    shadow-indigo-600/30
                                                `
                                                : `
                                                    text-slate-400
                                                    hover:bg-slate-800
                                                    hover:text-white
                                                `
                                        }

                                        ${
                                            isMobileOpen
                                                ? 'opacity-100 translate-x-0'
                                                : 'opacity-0 -translate-x-5'
                                        }

                                        md:opacity-100
                                        md:translate-x-0
                                    `}
                                >

                                    {/* ACTIVE BAR */}
                                    {isActive && (
                                        <span
                                            className="
                                                absolute

                                                left-0
                                                top-2
                                                bottom-2

                                                w-1

                                                bg-indigo-200

                                                rounded-r-full

                                                animate-pulse
                                            "
                                        />
                                    )}

                                    {/* ICON */}
                                    <span
                                        className="
                                            text-lg
                                            w-6
                                            shrink-0
                                            text-center

                                            transition-transform
                                            duration-300

                                            group-hover:scale-110
                                        "
                                    >
                                        {item.icon}
                                    </span>

                                    {/* LABEL */}
                                    <span
                                        className={`
                                            ml-3.5

                                            font-semibold
                                            text-xs

                                            whitespace-nowrap

                                            transition-all
                                            duration-300

                                            ${
                                                isCollapsed
                                                    ? 'md:opacity-0 md:w-0 md:overflow-hidden md:ml-0'
                                                    : 'opacity-100'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </span>

                                    {/* TOOLTIP */}
                                    {isCollapsed && (
                                        <span
                                            className="
                                                hidden
                                                md:block

                                                absolute
                                                left-full

                                                ml-3

                                                px-3
                                                py-2

                                                bg-slate-800
                                                text-white

                                                text-xs

                                                rounded-xl

                                                shadow-xl

                                                opacity-0

                                                group-hover:opacity-100

                                                pointer-events-none

                                                whitespace-nowrap

                                                border
                                                border-slate-700

                                                transition-opacity
                                                duration-200
                                            "
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                    </nav>
                </div>

                {/* =================================================
                    USER PROFILE
                ================================================== */}
                <div
                    className={`
                        p-3

                        bg-slate-800/50

                        rounded-2xl

                        flex
                        items-center
                        gap-3

                        border
                        border-slate-800

                        overflow-hidden

                        transition-all
                        duration-500
                        delay-300

                        ${
                            isMobileOpen
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }

                        md:opacity-100
                        md:translate-y-0
                    `}
                >

                    {/* USER AVATAR */}
                    <div
                        className="
                            w-9
                            h-9
                            shrink-0

                            rounded-xl

                            bg-indigo-500/20
                            text-indigo-400

                            font-bold

                            flex
                            items-center
                            justify-center

                            text-sm

                            border
                            border-indigo-500/30

                            transition-transform
                            duration-300

                            hover:scale-110
                        "
                    >
                        {user?.name?.charAt(0) || 'U'}
                    </div>

                    {/* USER INFO */}
                    <div
                        className={`
                            overflow-hidden
                            whitespace-nowrap

                            transition-all
                            duration-300

                            ${
                                isCollapsed
                                    ? 'md:opacity-0 md:w-0'
                                    : 'opacity-100'
                            }
                        `}
                    >
                        <p
                            className="
                                text-xs
                                font-semibold
                                text-white
                                truncate
                            "
                        >
                            {user?.name || 'User Profile'}
                        </p>

                        <p
                            className="
                                text-[10px]
                                text-indigo-400
                                font-bold
                                tracking-wider
                                uppercase
                            "
                        >
                            {user?.role || 'Guest'}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}