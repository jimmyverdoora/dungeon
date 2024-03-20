import React from 'react';
function Loading({ action }) {

  return (
    <div>
      {action && <div style={{ zIndex: 1, color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {action} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="/" style={{ textDecoration: 'none' }} >BACK</a>{'\u00A0'.repeat(action.length - 3)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
      </div>}
    </div>
  );
}

export default Loading;
