import React from 'react';
import './location.css';

const SaveButtons = ({
  onCancel = () => {},
  onSave = () => {}
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '20px',
      marginBottom: '20px'
    }}>
      <button
        onClick={onCancel}
        style={{
          backgroundColor: 'white',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
      >
        Save
      </button>
    </div>
  );
};

export default SaveButtons;
