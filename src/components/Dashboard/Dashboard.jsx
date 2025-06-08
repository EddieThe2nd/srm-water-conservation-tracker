import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const DashboardUI = () => {
  const navigate = useNavigate();
  const [mockData, setMockData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Usage');
  const [showEfficientUsers, setShowEfficientUsers] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  useEffect(() => {
    fetch('/mockData.json')
      .then(res => res.json())
      .then(data => {
        setMockData(data);
        if (data.users && data.users.length > 0) {
          setSelectedUser(data.users[0]);
        }
      })
      .catch(console.error);
  }, []);

  if (!mockData || !selectedUser) return <div>Loading...</div>;

  // Calculate average daily usage and efficiency for all users
  const usersWithEfficiency = mockData.users.map(user => {
    const avgDailyUsage = user.dailyUsageLitres.reduce((sum, day) => sum + day.litres, 0) / user.dailyUsageLitres.length;
    return {
      ...user,
      avgDailyUsage,
      isEfficient: avgDailyUsage < 350
    };
  });

  // Filter users based on efficiency and type
  const filteredUsers = usersWithEfficiency.filter(user => {
    const efficiencyMatch = !showEfficientUsers || user.isEfficient;
    const typeMatch = userTypeFilter === 'all' || user.type === userTypeFilter;
    return efficiencyMatch && typeMatch;
  });

  // Water tips function
  const getWaterTips = (user) => {
    const avg = user.avgDailyUsage;
    if (avg > 400) return "Consider installing low-flow faucets to reduce water flow by 30-50% without sacrificing performance.";
    if (avg > 350) return "Try reducing shower times by 2 minutes - this can save up to 10 litres per shower!";
    if (avg > 300) return "Check for leaky faucets - a dripping tap can waste up to 20 litres per day.";
    return "Great job conserving water! Your usage is well below the average household consumption.";
  };

  // Calculate usage metrics
  const monthlyUsage = selectedUser.monthlySummary?.April2025 || 0;
  const monthlyLimit = selectedUser.type === 'household' ? 800 : 20000;
  const usagePercent = Math.min(100, (monthlyUsage / monthlyLimit) * 100);
  const dailyAverage = selectedUser.dailyUsageLitres.reduce((sum, day) => sum + day.litres, 0) / selectedUser.dailyUsageLitres.length;

  // Prepare chart data
  const dailyUsageData = selectedUser.dailyUsageLitres.map(day => ({
    day: day.date.split('-')[2],
    usage: day.litres,
  }));

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <nav style={{
        width: 300,
        backgroundColor: '#2f3eeb',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        <div>
          <h2 style={{ marginBottom: '30px' }}>Water Dashboard Usage</h2>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setShowEfficientUsers(!showEfficientUsers)}
              style={{
                padding: '8px 12px',
                backgroundColor: showEfficientUsers ? '#1a25b8' : 'transparent',
                border: '1px solid white',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                marginBottom: '10px',
                width: '100%'
              }}
            >
              {showEfficientUsers ? 'Show All Users' : 'Show Efficient Users'}
            </button>

            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <button
                onClick={() => setUserTypeFilter('all')}
                style={{
                  flex: 1,
                  padding: '5px',
                  backgroundColor: userTypeFilter === 'all' ? '#1a25b8' : 'transparent',
                  border: '1px solid white',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              <button
                onClick={() => setUserTypeFilter('household')}
                style={{
                  flex: 1,
                  padding: '5px',
                  backgroundColor: userTypeFilter === 'household' ? '#1a25b8' : 'transparent',
                  border: '1px solid white',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Households
              </button>
              <button
                onClick={() => setUserTypeFilter('business')}
                style={{
                  flex: 1,
                  padding: '5px',
                  backgroundColor: userTypeFilter === 'business' ? '#1a25b8' : 'transparent',
                  border: '1px solid white',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Businesses
              </button>
            </div>
          </div>

          <h3 style={{ marginBottom: '10px' }}>Hubs</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Water Meters</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Valves</li>
          </ul>

          <h3 style={{ marginBottom: '10px' }}>Connected Users</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredUsers.map(user => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                data-testid={`user-item-${user.id}`} // Using data-testid for targeting
                style={{
                  padding: '10px',
                  backgroundColor: selectedUser.id === user.id ? '#1a25b8' : 'transparent',
                  borderRadius: '4px',
                  marginBottom: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{user.name}</span>
                {user.isEfficient && (
                  <span style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>Efficient</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p style={{ marginBottom: '10px' }}></p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1a25b8',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              width: '100%'
            }}>Logout</button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: '30px', backgroundColor: '#f4f6fc', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0 }}>{selectedUser.name}</h1>
              <p style={{ margin: '5px 0', color: '#666' }}>
                {selectedUser.type === 'household' ? 'Household' : 'Business'} • {selectedUser.region}
              </p>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#2f3eeb',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}>Edit device</button>
          </div>
        </header>

        {/* Usage summary */}
        <section style={{
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '10px solid #dfe7fd',
            position: 'relative',
            marginRight: '40px',
            flexShrink: 0
          }}>
            <svg viewBox="0 0 36 36" style={{ position: 'absolute', top: '-10px', left: '-10px', width: '140px', height: '140px' }}>
              <path
                stroke="#2f3eeb"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeDasharray={`${usagePercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              fontSize: '20px',
              color: '#2f3eeb'
            }}>
              {monthlyUsage.toFixed(0)} l
            </div>
          </div>

          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Monthly Usage</h3>
                <p style={{ margin: 0, color: '#666' }}>{monthlyUsage.toLocaleString()} / {monthlyLimit.toLocaleString()} litres</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Daily Average</h3>
                <p style={{ margin: 0, color: '#666' }}>
                  {dailyAverage.toFixed(0)} litres/day
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
              <div
                style={{
                  width: `${usagePercent}%`,
                  height: '100%',
                  backgroundColor: usagePercent > 90 ? '#f44336' : usagePercent > 70 ? '#FFC107' : '#4CAF50',
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section style={{ marginBottom: '20px' }}>
          {['Usage', 'Temperature', 'Ripples', 'Owners'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: activeTab === tab ? '#2f3eeb' : 'transparent',
                color: activeTab === tab ? 'white' : '#2f3eeb',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #2f3eeb' : 'none',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
            >
              {tab}
            </button>
          ))}
        </section>

        {/* Chart area */}
        <section style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          flexGrow: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'Usage' ? (
            <>
              <h3 style={{ marginTop: 0 }}>Daily Water Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyUsageData}>
                  <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Litres', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={value => [`${value.toLocaleString()} litres`, 'Daily Usage']} />
                  <Bar dataKey="usage" fill="#2f3eeb" name="Daily Usage" />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>{activeTab} Data</h3>
              <p>Detailed {activeTab.toLowerCase()} information will be displayed here when available.</p>
            </div>
          )}
        </section>
      </main>

      {/* Activity Monitor Panel */}
      <aside style={{
        width: '300px',
        backgroundColor: 'white',
        borderLeft: '1px solid #ccc',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0 }}>Activity Monitor</h3>

        {/* Water Saving Tips Card */}
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '4px solid #4CAF50'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>💧 Water Saving Tip</h4>
          <p style={{ margin: 0, fontSize: '0.9em' }}>
            {getWaterTips(selectedUser)}
          </p>
          {selectedUser.isEfficient && (
            <p style={{
              margin: '10px 0 0 0',
              fontSize: '0.8em',
              color: '#2e7d32',
              fontWeight: 'bold'
            }}>
              ✓ This {selectedUser.type === 'household' ? 'household' : 'business'} is using water efficiently
            </p>
          )}
        </div>

        {/* Alerts section */}
        {selectedUser.alerts.length === 0 ? (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>No alerts for this device</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
              Last checked: {new Date().toLocaleString()}
            </p>
          </div>
        ) : (
          selectedUser.alerts.map((alert, i) => {
            const color = alert.type.includes('failed') || alert.type === 'high_usage' ? '#f44336' : 
                         alert.type === 'unusual_pattern' ? '#FFC107' : '#4CAF50';
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '12px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }}></div>
                  <strong style={{ textTransform: 'capitalize' }}>
                    {alert.type.replace('_', ' ')}
                  </strong>
                </div>
                <p style={{ margin: '5px 0 0 22px', fontSize: '0.9em' }}>{alert.message}</p>
                <p style={{ margin: '5px 0 0 22px', fontSize: '0.8em', color: '#666' }}>
                  {new Date(alert.date).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </aside>
    </div>
  );
};

export default DashboardUI;
