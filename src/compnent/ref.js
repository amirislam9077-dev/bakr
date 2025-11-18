import React, { useState } from 'react';
import './location.css';

const References = ({
  references: initialReferences = [],
  onAddReference = () => {},
  onRemoveReference = () => {}
}) => {
  const [references, setReferences] = useState(initialReferences);

  const handleAddReference = () => {
    setReferences([...references, { label: '', url: '' }]);
    onAddReference();
  };

  const handleRemoveReference = (index) => {
    const newReferences = references.filter((_, i) => i !== index);
    setReferences(newReferences);
    onRemoveReference(index);
  };

  const handleReferenceChange = (index, field, value) => {
    const newReferences = [...references];
    newReferences[index] = { ...newReferences[index], [field]: value };
    setReferences(newReferences);
  };

  return (
    <div className="location-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-10px', marginBottom: '16px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>References</h2>
        <button
          onClick={handleAddReference}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'inherit'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '600' }}>+</span>
          Add Reference
        </button>
      </div>

      {references.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '12px',
          padding: '10px 0'
        }}>
          No references added yet. Click "Add Reference" to get started.
        </div>
      ) : (
        <div>
          {references.map((ref, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <input
                type="text"
                value={ref.label}
                onChange={(e) => handleReferenceChange(index, 'label', e.target.value)}
                placeholder="Label"
                className="form-input"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  height: 'auto'
                }}
              />
              <input
                type="text"
                value={ref.url}
                onChange={(e) => handleReferenceChange(index, 'url', e.target.value)}
                placeholder="URL"
                className="form-input"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  height: 'auto'
                }}
              />
              <button
                onClick={() => handleRemoveReference(index)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default References;
