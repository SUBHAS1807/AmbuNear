import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Ambulance,
  PhoneCall,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ onOpenSearch }) => {
  const { user, isAuthenticated, isDriver, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'box-shadow var(--transition-normal), background-color var(--transition-normal)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
          aria-label="AmbuNear Homepage"
        >
          <div
            style={{
              backgroundColor: 'var(--color-emergency)',
              color: '#fff',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
            }}
          >
            <Ambulance size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Ambu<span style={{ color: 'var(--color-emergency)' }}>Near</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              EMERGENCY HELP
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/ambulances"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}
          >
            Find Ambulances
          </NavLink>
          <NavLink
            to="/how-it-works"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/safety"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}
          >
            Safety
          </NavLink>
          <NavLink
            to="/faq"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}
          >
            FAQ
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-bookings"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
              })}
            >
              My Bookings
            </NavLink>
          )}

          {isDriver && (
            <NavLink
              to="/driver-dashboard"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
              })}
            >
              <Activity size={16} /> Driver Panel
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin-dashboard"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
              })}
            >
              <Shield size={16} /> Admin
            </NavLink>
          )}
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Emergency Hotline Button */}
          <a
            href="tel:108"
            className="emergency-hotline-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-emergency-subtle)',
              color: 'var(--color-emergency)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
            title="Official National Emergency Service"
          >
            <PhoneCall size={14} /> 108 / 112
          </a>

          {/* Site Search Modal Trigger */}
          <button
            onClick={onOpenSearch}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 0.6rem' }}
            aria-label="Open search dialog (Ctrl+K)"
            title="Search site (Ctrl+K)"
          >
            <Search size={16} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 0.6rem' }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/profile"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserIcon size={15} />
                <span className="user-name-label">{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                aria-label="Log out"
                title="Log out"
                style={{ padding: '0.45rem 0.6rem' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'none',
            }}
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Embedded Responsive Nav Styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .emergency-hotline-pill { display: none !important; }
          .user-name-label { display: none; }
        }
      `}</style>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <NavLink
            to="/ambulances"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            Find Ambulances
          </NavLink>
          <NavLink
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            How It Works
          </NavLink>
          <NavLink
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            Safety Guidelines
          </NavLink>
          <NavLink
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            FAQ
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            Contact
          </NavLink>

          {isAuthenticated && (
            <>
              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.25rem 0' }} />
              <NavLink
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
              >
                My Bookings
              </NavLink>
              {isDriver && (
                <NavLink
                  to="/driver-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  Driver Dashboard
                </NavLink>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  Admin Portal
                </NavLink>
              )}
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                Profile & Settings
              </NavLink>
            </>
          )}

          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--color-emergency-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-emergency)' }}>
              Emergency Ambulance Hotline:
            </span>
            <a
              href="tel:108"
              style={{
                fontWeight: 800,
                color: 'var(--color-emergency)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <PhoneCall size={16} /> 108 / 112
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
