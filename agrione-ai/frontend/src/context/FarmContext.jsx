import React, { createContext, useContext, useState, useEffect } from 'react';
import { farmApi } from '../api/farmApi';
import { schemesApi } from '../api/schemesApi';
import { useAuth } from './AuthContext';

const FarmContext = createContext(null);

const DEFAULT_FARMS = [
  {
    _id: 'farm-01',
    name: 'Green Valley Plot A',
    location: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Pedavadlapudi',
    },
    totalArea: 5.5,
    areaUnit: 'acres',
    soilType: 'black',
    irrigationSource: 'borewell',
    primaryCrop: 'Cotton',
    currentCrops: ['Cotton', 'Chilli'],
    soilData: {
      nitrogen: 135,
      phosphorus: 42,
      potassium: 195,
      ph: 6.8,
      organicCarbon: 0.65,
      moisture: 28,
    },
  },
  {
    _id: 'farm-02',
    name: 'Krishna Riverfront Field',
    location: {
      state: 'Andhra Pradesh',
      district: 'Krishna',
      village: 'Kankipadu',
    },
    totalArea: 3.2,
    areaUnit: 'acres',
    soilType: 'alluvial',
    irrigationSource: 'canal',
    primaryCrop: 'Rice',
    currentCrops: ['Rice'],
    soilData: {
      nitrogen: 180,
      phosphorus: 55,
      potassium: 220,
      ph: 7.2,
      organicCarbon: 0.8,
      moisture: 35,
    },
  },
];

export const FarmProvider = ({ children }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState(DEFAULT_FARMS);
  const [activeFarm, setActiveFarm] = useState(DEFAULT_FARMS[0]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      _id: 'notif-1',
      title: 'Optimal Sowing Window',
      message: 'Upcoming weather conditions in Guntur indicate 85% favorable moisture for Kharif Cotton sowing.',
      type: 'recommendation',
      severity: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'notif-2',
      title: 'High Humidity Pest Alert',
      message: 'Relative humidity exceeds 82%. Monitor cotton leaves closely for early aphid/jassid infestation.',
      type: 'disease_alert',
      severity: 'warning',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Fetch farms when user changes
  useEffect(() => {
    const loadFarms = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await farmApi.getFarms();
        if (res?.farms && res.farms.length > 0) {
          setFarms(res.farms);
          setActiveFarm(res.farms[0]);
        } else {
          setFarms(DEFAULT_FARMS);
          setActiveFarm(DEFAULT_FARMS[0]);
        }
      } catch (err) {
        // Fallback to demo farms
        setFarms(DEFAULT_FARMS);
        setActiveFarm(DEFAULT_FARMS[0]);
      } finally {
        setLoading(false);
      }
    };

    loadFarms();
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await schemesApi.getNotifications();
        if (res?.notifications && res.notifications.length > 0) {
          setNotifications(res.notifications);
        }
      } catch (e) {
        // keep defaults
      }
    };
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const addFarm = async (farmData) => {
    try {
      const res = await farmApi.createFarm(farmData);
      const newFarm = res?.farm || {
        _id: 'farm-' + Date.now(),
        ...farmData,
        soilData: farmData.soilData || {
          nitrogen: 120,
          phosphorus: 35,
          potassium: 160,
          ph: 7.0,
          organicCarbon: 0.5,
          moisture: 25,
        },
      };
      setFarms((prev) => [newFarm, ...prev]);
      setActiveFarm(newFarm);
      return { success: true, farm: newFarm };
    } catch (err) {
      // Local fallback
      const newFarm = {
        _id: 'farm-' + Date.now(),
        ...farmData,
        soilData: farmData.soilData || {
          nitrogen: 120,
          phosphorus: 35,
          potassium: 160,
          ph: 7.0,
          organicCarbon: 0.5,
          moisture: 25,
        },
      };
      setFarms((prev) => [newFarm, ...prev]);
      setActiveFarm(newFarm);
      return { success: true, farm: newFarm };
    }
  };

  const updateSoil = async (farmId, soilData) => {
    try {
      await farmApi.updateSoil(farmId, soilData);
    } catch (err) {
      console.warn('Updated soil locally');
    }
    setFarms((prev) =>
      prev.map((f) =>
        f._id === farmId ? { ...f, soilData: { ...f.soilData, ...soilData } } : f
      )
    );
    if (activeFarm?._id === farmId) {
      setActiveFarm((prev) => ({
        ...prev,
        soilData: { ...prev.soilData, ...soilData },
      }));
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await schemesApi.markAllRead();
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        activeFarm,
        setActiveFarm,
        loading,
        addFarm,
        updateSoil,
        notifications,
        setNotifications,
        showNotificationDrawer,
        setShowNotificationDrawer,
        markAllNotificationsRead,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
