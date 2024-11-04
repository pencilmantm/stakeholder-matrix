import React from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [components, setComponents] = React.useState([]);
  const [inputText, setInputText] = React.useState('');
  const captureRef = React.useRef(null);

  const colors = [
    '#bfdbfe', // blue
    '#bbf7d0', // green
    '#fecaca', // red
    '#fed7aa', // orange
    '#e9d5ff', // purple
    '#fde68a', // yellow
    '#ddd6fe', // violet
    '#99f6e4', // teal
  ];

  const addComponent = () => {
    if (inputText.trim()) {
      const colorIndex = components.length % colors.length;
      setComponents([...components, { 
        id: Date.now(), 
        text: inputText,
        color: colors[colorIndex]
      }]);
      setInputText('');
    }
  };

  const deleteComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const captureScreen = async () => {
    try {
      const canvas = await html2canvas(captureRef.current);
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast.success('Screenshot copied to clipboard!');
      });
    } catch (err) {
      toast.error('Failed to capture screenshot');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <Toaster position="top-right" />
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addComponent()}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
          placeholder="Enter Stakeholder name"
        />
        <button
          onClick={addComponent}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Stakeholder
        </button>
        <button
          onClick={captureScreen}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          📸 Capture Matrix Screenshot
        </button>
      </div>

      <div style={{ position: 'relative', margin: '60px 60px 80px 60px' }} ref={captureRef}>
        {/* Y-axis label */}
        <div style={{ 
          position: 'absolute', 
          left: '-100px', 
          top: '50%', 
          transform: 'rotate(-90deg) translateX(50%)',
          whiteSpace: 'nowrap',
          fontWeight: 'bold'
        }}>
          Interest
        </div>
        
        {/* Y-axis values */}
        <div style={{ position: 'absolute', left: '-45px', top: '0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
        </div>

        {/* X-axis label */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-60px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          fontWeight: 'bold'
        }}>
          Influence
        </div>

        {/* X-axis values */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-35px', 
          left: '0', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between',
        }}>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          border: '2px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white',
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            pointerEvents: 'none'
          }}>
            <div style={{ 
              borderRight: '1px solid #ccc', 
              borderBottom: '1px solid #ccc',
              position: 'relative'
            }}>
              <div className="quadrant-label">
                Minimal Effort
                <div className="quadrant-description">Low influence, low interest – little engagement required</div>
              </div>
            </div>
            <div style={{ 
              borderBottom: '1px solid #ccc',
              position: 'relative'
            }}>
              <div className="quadrant-label">
                Monitor
                <div className="quadrant-description">High influence, low interest – track but engage minimally</div>
              </div>
            </div>
            <div style={{ 
              borderRight: '1px solid #ccc',
              position: 'relative'
            }}>
              <div className="quadrant-label">
                Show Consideration
                <div className="quadrant-description">Low influence, high interest – keep informed and value their interest</div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="quadrant-label">
                Key Players
                <div className="quadrant-description">High influence, high interest – actively engage and involve</div>
              </div>
            </div>
          </div>

          {components.map(comp => (
            <Draggable key={comp.id} bounds="parent">
              <div style={{
                position: 'absolute',
                padding: '12px',
                backgroundColor: comp.color,
                borderRadius: '4px',
                cursor: 'move',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {comp.text}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(comp.id);
                  }}
                  className="delete-button"
                  style={{
                    padding: '2px 6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;