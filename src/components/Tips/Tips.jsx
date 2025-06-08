import { useState, useEffect } from 'react';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Simulated tips based on different conditions
    const waterTips = [
      {
        title: "Fix Leaky Faucets",
        description: "A dripping faucet can waste 20 gallons of water a day. Fix leaks promptly!",
        category: "indoor"
      },
      {
        title: "Shorter Showers",
        description: "Reduce your shower time by 2 minutes to save up to 10 gallons per shower.",
        category: "indoor"
      },
      {
        title: "Water-Efficient Plants",
        description: "Landscape with drought-resistant plants to reduce outdoor water use by 20-50%.",
        category: "outdoor"
      },
      {
        title: "Full Loads Only",
        description: "Run your dishwasher and washing machine only when they're full to save water.",
        category: "appliance"
      },
      {
        title: "Turn Off Tap",
        description: "Turn off the tap while brushing teeth or shaving to save up to 8 gallons per day.",
        category: "indoor"
      }
    ];
    
    setTips(waterTips);
  }, []);

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
  };

  if (tips.length === 0) return <div>Loading tips...</div>;

  return (
    <div className="tips-container">
      <h1>Water Conservation Tips</h1>
      
      <div className="tip-card">
        <h3>{tips[currentTipIndex].title}</h3>
        <p>{tips[currentTipIndex].description}</p>
        <div className="tip-category">
          Category: <span>{tips[currentTipIndex].category}</span>
        </div>
      </div>

      <div className="tip-navigation">
        <button onClick={prevTip} className="btn-secondary">
          Previous Tip
        </button>
        <button onClick={nextTip} className="btn-primary">
          Next Tip
        </button>
      </div>

      <div className="progress-indicator">
        Tip {currentTipIndex + 1} of {tips.length}
      </div>
    </div>
  );
};

export default Tips;