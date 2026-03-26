import React, { useState } from 'react';
import './Analyze.css';

// 1. ข้อมูล Palette แบ่งตาม Undertone
const COLOR_DATA = {
  warm: {
    title: "Warm Undertone",
    desc: "ผิวโทนอุ่นเหมาะกับเฉดสีกลุ่ม Earth Tone, ทอง และส้มอิฐ เพื่อขับเน้นรัศมีของผิวให้ดูผ่องใสและสุขภาพดีที่สุด",
    palette: [
      { hex: "#A64B2A", name: "Terra" }, { hex: "#D8A25E", name: "Honey" },
      { hex: "#E3735E", name: "Coral" }, { hex: "#C77966", name: "Caramel" },
      { hex: "#8B6C5C", name: "Mocha" }
    ]
  },
  cool: {
    title: "Cool Undertone",
    desc: "ผิวโทนเย็นเหมาะกับเฉดสีกลุ่มพาสเทล, ชมพูตุ่น, ม่วงลาเวนเดอร์ หรือสีเงิน เพื่อขับผิวให้ดูขาวกระจ่างใสและนุ่มนวล",
    palette: [
      { hex: "#CC8899", name: "Rose" }, { hex: "#9B6BB3", name: "Lilac" },
      { hex: "#6D8DAA", name: "Slate" }, { hex: "#C55F90", name: "Berry" },
      { hex: "#9EB3C2", name: "Frost" }
    ]
  },
  neutral: {
    title: "Neutral Undertone",
    desc: "ผิวโทนกลางมีความยืดหยุ่นสูง สามารถใช้ได้ทั้งสีโทนร้อนและเย็น โดยเฉพาะสีกลุ่ม Nude, Taupe และสีสว่างจะช่วยให้ดูแพง",
    palette: [
      { hex: "#BC8F8F", name: "Taupe" }, { hex: "#C2B280", name: "Sand" },
      { hex: "#BDA7A0", name: "Blush" }, { hex: "#A39887", name: "Mushroom" },
      { hex: "#977C6D", name: "Cocoa" }
    ]
  }
};

const SHAPES = [
  { id: 'almond', name: 'Almond', desc: 'ทรงยอดนิยมที่ช่วยให้นิ้วดูเรียวยาวและหรูหราแบบ Editorial.', svg: 'M20,50 Q30,10 40,50 L40,90 L20,90 Z' },
  { id: 'oval', name: 'Oval', desc: 'ทรงคลาสสิกที่ให้ความละมุน ดูสะอาดและเป็นธรรมชาติ.', svg: 'M20,40 Q30,5 40,40 L40,90 L20,90 Z' },
  { id: 'squoval', name: 'Squoval', desc: 'ทันสมัย มั่นใจ แต่ยังมีความนุ่มนวลของขอบมน.', svg: 'M20,30 Q30,25 40,30 L40,90 L20,90 Z' },
  { id: 'square', name: 'Square', desc: 'เฉียบคมและทรงพลัง เหมาะกับลุคที่ต้องการความชัดเจน.', svg: 'M20,20 L40,20 L40,90 L20,90 Z' }
];

const AnalyzePage = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, completed
  const [result, setResult] = useState(null); // เก็บผลลัพธ์ที่สุ่มได้
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const runAnalysis = () => {
    setStatus('analyzing');
    
    // จำลองการสุ่มผลวิเคราะห์
    setTimeout(() => { 
      const tones = ['warm', 'cool', 'neutral'];
      const picked = tones[Math.floor(Math.random() * tones.length)];
      setResult(COLOR_DATA[picked]);
      setStatus('completed'); 
    }, 2000); 
  };

  return (
    <div className="analyze-container">
     

      <div className="analyze-content">
        {status !== 'completed' && (
          <div className="upload-section">
            <span className="result-label">Diagnostic Tool</span>
            <h1 style={{fontFamily:'Playfair Display', fontSize:'36px', marginTop:'10px',fontWeight:'300'}}>Analyze Your Tone</h1>
            <div className="upload-box">
              <div className="upload-inner" onClick={() => document.getElementById('f').click()}>
                {image ? <img src={image} alt="Target" /> : <p>Tap to Upload Photo</p>}
              </div>
            </div>
            <input id="f" type="file" hidden onChange={handleUpload} />
            
            {status === 'analyzing' ? (
              <div className="loading-spinner" style={{marginTop:'30px'}}>ANALYZING TEXTURE & HUE...</div>
            ) : (
              <button className="btn-luxury" onClick={runAnalysis} disabled={!image}>
                Start Skin Analysis
              </button>
            )}
          </div>
        )}

        {status === 'completed' && result && (
          <div className="results-area">
            {/* Left Column */}
            <div>
              <div className="result-header">
                <span className="result-label">01 / Analysis Result</span>
                <h2 style={{fontFamily:'Playfair Display', fontSize:'28px', marginTop:'10px'}}>{result.title}</h2>
              </div>
              <div style={{border:'1px solid #D8D2C6', padding:'10px', background:'white'}}>
                <img src={image} alt="Analyzed" style={{width:'100%', aspectRatio:'4/5', objectFit:'cover'}} />
              </div>
              <div style={{marginTop:'30px'}}>
                <p style={{fontSize:'14px', lineHeight:'1.8', color:'#666'}}>
                  "{result.desc}"
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="result-header">
                <span className="result-label">02 / Recommendations</span>
                <h2 style={{fontFamily:'Playfair Display', fontSize:'28px', marginTop:'10px'}}>Color  Architecture</h2>
              </div>

              {/* Dynamic Palette */}
              <div style={{marginBottom:'50px'}}>
                <h3 style={{fontFamily:'Playfair Display', fontSize:'14px', textTransform:'uppercase'}}>Suggested Palette</h3>
                <div className="palette-grid">
                  {result.palette.map(c => (
                    <div key={c.hex} className="swatch">
                      <div className="swatch-color" style={{background: c.hex}}></div>
                      <span style={{fontSize:'8px', letterSpacing:'1px'}}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shapes */}
              <div>
                <h3 style={{fontFamily:'Playfair Display', fontSize:'14px', textTransform:'uppercase'}}>Nail Architecture</h3>
                <div className="shape-grid">
                  {SHAPES.map(s => (
                    <div key={s.id} className={`shape-card ${selectedShape.id === s.id ? 'active' : ''}`} onClick={() => setSelectedShape(s)}>
                      <svg viewBox="0 0 60 100" className="shape-svg"><path d={s.svg} fill="currentColor" /></svg>
                      <div style={{fontSize:'9px'}}>{s.name}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'25px', padding:'20px', background:'white', borderLeft:'3px solid #B09987'}}>
                  <h4 style={{fontFamily:'Playfair Display', margin:'0 0 10px 0'}}>{selectedShape.name} Detail</h4>
                  <p style={{fontSize:'13px', color:'#666', margin:0}}>{selectedShape.desc}</p>
                </div>
              </div>

              <button className="btn-luxury" onClick={() => { setStatus('idle'); setResult(null); }} style={{width:'100%', marginTop:'40px'}}>
                New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;