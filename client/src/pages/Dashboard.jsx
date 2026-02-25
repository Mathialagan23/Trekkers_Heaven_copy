import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaHotel, FaPlane, FaBus, FaRoute, FaMapMarkedAlt, FaMoneyBillWave, FaTrain } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { getItineraries, updateItinerary } from '../services/itineraryService';
import QuickExpenseModal from '../components/QuickExpenseModal';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [activeId, setActiveId] = useState(localStorage.getItem('activeItineraryId') || null);
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showItineraryDropdown, setShowItineraryDropdown] = useState(false);


  const sections = [
    {
      title: 'Accommodations',
      icon: <FaHotel />,
      link: '/accommodations',
      description: 'Manage your hotel bookings',
      bookingLink: 'https://www.hostelworld.com/?source=ppc_gooads_brand_dsk_search_brd_en_row&network=g&campaign_id=13461949562&adgroup_id=130259537424&criteria_id=kwd-129091712&creative_id=594756953728&location_physical_id=9153002&location_interest_id=&adposition=&uniqueclickID=14419004993175840513&sub_keyword=hostel+world&sub_ad=e&sub_publisher=ADW&gclsrc=aw.ds&gad_source=1&gad_campaignid=13461949562&gbraid=0AAAAAD9QXQa351RbXtq59HvBTRMInH2AN&gclid=Cj0KCQiA6sjKBhCSARIsAJvYcpPpzi_-TXK_pnlPhKTcCV0HN-dDkq8wTG17-ynIF64SFYNCpPTe0gcaAjCXEALw_wcB'
    },
    {
      title: 'Flights',
      icon: <FaPlane />,
      link: '/flights',
      description: 'Track your flight reservations',
      bookingLink: 'https://www.skyscanner.co.in/?locale=en-GB&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=IN-Travel-Search-Brand-SkyscannerPure-Desktop&utm_term=skyscanner&associateID=SEM_FLI_19465_00000&campaign_id=21456707965&adgroupid=167310367911&keyword_id=kwd-400074527&gad_source=1&gad_campaignid=21456707965&gbraid=0AAAAAD3oWFgENruzqcyHVtGtE7LMpxLOt&gclid=Cj0KCQiA6sjKBhCSARIsAJvYcpP16pTTKy33WiI-L7yM8OIUvlba6LUKRX_0Y0ZqLX2TRRP0ETmanWwaAvJ3EALw_wcB'
    },
    {
      title: 'Bus Travel',
      icon: <FaBus />,
      link: '/buses',
      description: 'Organize your bus journeys',
      bookingLink: 'https://www.redbus.in/?utm_source=google&utm_medium=cpc&utm_campaign=Brand-Search-IN-DSA-Exact&utm_term=redbus&gclid=Cj0KCQiA6sjKBhCSARIsAJvYcpP0e5zX3K8j4k1kZbYF6EpG1bqQ1Z6j3p8YF6kgV2gD3yXc1vWlY0aAsX_EALw_wcB'
    },
    {
      title: 'Itineraries',
      icon: <FaRoute />,
      link: '/itineraries',
      description: 'Plan your trip schedules'
    },
    {
      title: 'Map View',
      icon: <FaMapMarkedAlt />,
      link: '/map',
      description: 'Visualize your destinations'
    },
    {
      title: 'Trains',
      icon: <FaTrain />,
      link: '/trains',
      description: 'Manage your train journeys'
    },
    {
      title: 'Expenses',
      icon: <FaMoneyBillWave />,
      link: '/expenses',
      description: 'Track your trip expenses',
      isExpense: true
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getItineraries();
        setItineraries(Array.isArray(data) ? data : []);

        // restore active itinerary if stored
        const stored = localStorage.getItem('activeItineraryId');
        if (stored) {
          const found = data.find((it) => it._id === stored);
          if (found) {
            setActiveId(found._id);
            setActiveItinerary(formatActive(found));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const formatActive = (it) => {
    return {
      _id: it._id,
      title: it.title,
      budget: it.budget || 0,
      totalSpent: it.totalSpent || 0,
      remainingBudget: (it.budget || 0) - (it.totalSpent || 0),
      currency: getItineraryCurrency(it._id)
    };
  };

  const setActive = (it) => {
    setActiveId(it._id);
    localStorage.setItem('activeItineraryId', it._id);
    setActiveItinerary(formatActive(it));
  };

  const refreshItineraries = async () => {
    const data = await getItineraries();
    setItineraries(Array.isArray(data) ? data : []);
    if (activeId) {
      const found = data.find((i) => i._id === activeId);
      if (found) setActiveItinerary(formatActive(found));
      else { setActiveId(null); setActiveItinerary(null); localStorage.removeItem('activeItineraryId'); }
    }
  };

  // close dropdown on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!showItineraryDropdown) return;
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setShowItineraryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showItineraryDropdown]);

  // listen for totals updated events from other pages (e.g., add bus/flight/accommodation)
  useEffect(() => {
    const handler = (e) => {
      try {
        const detail = e.detail || {};
        if (!detail || !detail.itineraryId) return;
        if (activeId && detail.itineraryId === activeId) {
          refreshItineraries();
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('itineraryTotalsUpdated', handler);
    return () => window.removeEventListener('itineraryTotalsUpdated', handler);
  }, [activeId]);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Manage your travel plans and adventures</p>
        </div>

        <div className="dashboard-grid">
          {sections.map((section, index) => (
            <div
              key={index}
              className="dashboard-card"
              role="link"
              tabIndex={0}
              onClick={() => { if (!section.isExpense) navigate(section.link); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !section.isExpense) navigate(section.link); }}
            >
              <div className="dashboard-icon">{section.icon}</div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>

              {section.title === 'Accommodations' && (
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (section.bookingLink) window.open(section.bookingLink, '_blank'); }}
                    disabled={!section.bookingLink}
                  >
                    Book Now
                  </button>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(section.link); }}
                  >
                    Manage
                  </button>
                </div>
              )}

              {section.title === 'Flights' && (
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (section.bookingLink) window.open(section.bookingLink, '_blank'); }}
                    disabled={!section.bookingLink}
                  >
                    Book Now
                  </button>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(section.link); }}
                  >
                    Manage
                  </button>
                </div>
              )}

              {section.title === 'Bus Travel' && (
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (section.bookingLink) window.open(section.bookingLink, '_blank');
                    }}
                    disabled={!section.bookingLink}
                  >
                    Book Now
                  </button>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(section.link);
                    }}
                  >
                    Manage
                  </button>
                </div>
              )}


              {section.title === 'Trains' && (
                <div className="card-actions">
                  <button
                    className="btn btn-outline btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(section.link); }}
                  >
                    Manage
                  </button>
                </div>
              )}



              {section.title === 'Itineraries' && (
                <div className="card-actions" style={{ alignItems: 'center' }}>
                  <button
                    className="btn btn-outline btn-small"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(section.link); }}
                  >
                    Manage
                  </button>

                  <div ref={dropdownRef} style={{ position: 'relative', marginLeft: 8 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-outline btn-small"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowItineraryDropdown((s) => !s); }}
                    >
                      Select
                    </button>

                    {showItineraryDropdown && (
                      <div style={{ position: 'absolute', top: '40px', left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 20, width: 220 }}>
                        <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                          {itineraries.map((it) => (
                            <div
                              key={it._id}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActive(it); setShowItineraryDropdown(false); }}
                              style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                            >
                              {it.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {section.isExpense && (
                <div className="card-actions" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {activeItinerary ? (
                    <>
                      <div style={{ marginBottom: 6 }}><small>{activeItinerary.title}</small></div>
                      <div style={{ marginBottom: 6 }}><small>Budget: <strong>{formatCurrency(activeItinerary.budget || 0, activeItinerary.currency)}</strong></small></div>
                      <div style={{ marginBottom: 6 }}><small>Used: <strong>{Math.round(((activeItinerary.totalSpent || 0) / Math.max(1, (activeItinerary.budget || 0))) * 100)}%</strong></small></div>
                      <div style={{ marginBottom: 8 }}><small>Remaining: <strong>{formatCurrency(activeItinerary.remainingBudget || 0, activeItinerary.currency)}</strong></small></div>

                      {activeItinerary.budget > 0 && (activeItinerary.totalSpent / activeItinerary.budget) >= 0.75 && (
                        <div style={{ color: '#b85b00', marginBottom: 8 }}><strong>⚠️ Budget ≥ 75% used</strong></div>
                      )}

                      {/* Empty expense state */}
                      {(activeItinerary.totalSpent || 0) === 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <small>No expenses added for this trip yet.</small>
                          <div style={{ marginTop: 6 }}>
                            <button className="btn btn-primary btn-small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickAdd(true); }}>Add First Expense</button>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-outline btn-small"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/expenses/${activeItinerary._id}`); }}
                        >
                          Manage Expenses
                        </button>

                        <button
                          className="btn btn-outline btn-small"
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            const value = prompt('Enter new budget amount (numbers only):', String(activeItinerary.budget || 0));
                            if (value === null) return;
                            const num = Number(value);
                            if (isNaN(num) || num < 0) { alert('Invalid budget'); return; }
                            updateItinerary(activeItinerary._id, { budget: num }).then(() => {
                              // refresh and update active
                              refreshItineraries();
                            }).catch((err) => { console.error(err); alert('Failed to update budget'); });
                          }}
                        >
                          Extend Budget
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: 8 }}><small>No active itinerary</small></div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowItineraryDropdown(true); }}>Select Itinerary</button>
                        <button
                          className="btn btn-outline btn-small"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/itineraries'); }}
                        >
                          Manage Itineraries
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {showQuickAdd && activeItinerary && (
          <QuickExpenseModal
            itineraryId={activeItinerary._id}
            onClose={() => setShowQuickAdd(false)}
            onAdded={async () => { await refreshItineraries(); setShowQuickAdd(false); }}
          />
        )}

      </div>
    </div>
  );
};

export default Dashboard;