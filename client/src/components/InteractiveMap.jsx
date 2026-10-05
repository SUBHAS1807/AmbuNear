import React from 'react';
import { Navigation, Ambulance, MapPin, Compass } from 'lucide-react';
import { formatDistance, formatTimeAgo } from '../utils/formatters';

export const InteractiveMap = ({
  userCoords,
  ambulances = [],
  selectedAmbulanceId,
  onSelectAmbulance,
  searchRadiusKm = 25,
}) => {
  // Center coordinates (default: Delhi-NCR pilot area)
  const centerLat = userCoords?.latitude || 28.6139;
  const centerLng = userCoords?.longitude || 77.2090;

  // Viewbox size for the canvas/SVG
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Project lat/lng to local SVG coordinate space (approx 1 km = ~12 px at scale)
  const pxPerKm = 10;
  const kmPerDegLat = 111;
  const kmPerDegLng = 111 * Math.cos((centerLat * Math.PI) / 180);

  const project = (lat, lng) => {
    const dLatKm = (lat - centerLat) * kmPerDegLat;
    const dLngKm = (lng - centerLng) * kmPerDegLng;
    const x = centerX + dLngKm * pxPerKm;
    const y = centerY - dLatKm * pxPerKm; // inverted Y
    return { x: Math.max(20, Math.min(width - 20, x)), y: Math.max(20, Math.min(height - 20, y)) };
  };

  const userPoint = project(centerLat, centerLng);

  return (
    <div
      className="card map-container"
      style={{
        position: 'relative',
        padding: '0',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Top Map Bar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)',
            pointerEvents: 'auto',
          }}
        >
          <Compass size={14} color="var(--color-primary)" />
          <span>Interactive Radar Map ({ambulances.length} Active in Radius)</span>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
            pointerEvents: 'auto',
          }}
        >
          Radius: {searchRadiusKm} km
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '380px',
          display: 'block',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--border-light)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Concentric radar range rings */}
        <circle
          cx={userPoint.x}
          cy={userPoint.y}
          r={5 * pxPerKm}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />
        <circle
          cx={userPoint.x}
          cy={userPoint.y}
          r={10 * pxPerKm}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.2"
        />
        <circle
          cx={userPoint.x}
          cy={userPoint.y}
          r={20 * pxPerKm}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.15"
        />

        {/* Lines from User to each Ambulance */}
        {ambulances.map((amb) => {
          if (!amb.location?.coordinates) return null;
          const pos = project(amb.location.coordinates[1], amb.location.coordinates[0]);
          const isSelected = selectedAmbulanceId === amb._id;
          return (
            <line
              key={`line-${amb._id}`}
              x1={userPoint.x}
              y1={userPoint.y}
              x2={pos.x}
              y2={pos.y}
              stroke={isSelected ? 'var(--color-emergency)' : 'var(--color-primary)'}
              strokeWidth={isSelected ? '2' : '1'}
              strokeDasharray={isSelected ? 'none' : '3 3'}
              opacity={isSelected ? '0.85' : '0.35'}
            />
          );
        })}

        {/* Patient / User Position Marker */}
        <g transform={`translate(${userPoint.x}, ${userPoint.y})`}>
          <circle r="18" fill="var(--color-primary-subtle)" opacity="0.6" />
          <circle r="10" fill="var(--color-primary)" />
          <circle r="4" fill="#ffffff" />
          <text
            y="28"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="10"
            fontWeight="700"
          >
            Your Pickup Location
          </text>
        </g>

        {/* Nearby Ambulances Markers */}
        {ambulances.map((amb) => {
          if (!amb.location?.coordinates) return null;
          const pos = project(amb.location.coordinates[1], amb.location.coordinates[0]);
          const isSelected = selectedAmbulanceId === amb._id;
          const isAvailable = amb.availability === 'AVAILABLE';

          return (
            <g
              key={amb._id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelectAmbulance && onSelectAmbulance(amb)}
              style={{ cursor: 'pointer' }}
            >
              {isSelected && (
                <circle
                  r="22"
                  fill="none"
                  stroke="var(--color-emergency)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              )}
              <circle
                r="14"
                fill={
                  isSelected
                    ? 'var(--color-emergency)'
                    : isAvailable
                    ? 'var(--color-available)'
                    : 'var(--color-offline)'
                }
              />
              <text
                y="4"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                🚑
              </text>
              <text
                y="24"
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="9"
                fontWeight="600"
              >
                {amb.vehicleNumber} ({formatDistance(amb.distanceKm)})
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom Map Legend */}
      <div
        style={{
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            <span>Pickup Spot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-available)' }} />
            <span>Available Ambulance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-emergency)' }} />
            <span>Selected</span>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Click an ambulance marker to select
        </div>
      </div>
    </div>
  );
};
