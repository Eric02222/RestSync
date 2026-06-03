import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favoriteResidents, setFavoriteResidents] = useState([]);
  const [favoriteVitals, setFavoriteVitals] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedResidents = localStorage.getItem('restsync_fav_residents');
    const storedVitals = localStorage.getItem('restsync_fav_vitals');

    if (storedResidents) {
      try {
        setFavoriteResidents(JSON.parse(storedResidents));
      } catch (e) {
        console.error('Error parsing favorite residents', e);
      }
    }

    if (storedVitals) {
      try {
        setFavoriteVitals(JSON.parse(storedVitals));
      } catch (e) {
        console.error('Error parsing favorite vitals', e);
      }
    }
  }, []);

  const toggleResidentFavorite = useCallback((id) => {
    setFavoriteResidents((prev) => {
      const numericId = parseInt(id);
      const newFavs = prev.includes(numericId)
        ? prev.filter((favId) => favId !== numericId)
        : [...prev, numericId];
      localStorage.setItem('restsync_fav_residents', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const toggleVitalFavorite = useCallback((vitalKey) => {
    setFavoriteVitals((prev) => {
      const newFavs = prev.includes(vitalKey)
        ? prev.filter((key) => key !== vitalKey)
        : [...prev, vitalKey];
      localStorage.setItem('restsync_fav_vitals', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const isResidentFavorite = (id) => favoriteResidents.includes(parseInt(id));
  const isVitalFavorite = (vitalKey) => favoriteVitals.includes(vitalKey);

  return {
    favoriteResidents,
    favoriteVitals,
    toggleResidentFavorite,
    toggleVitalFavorite,
    isResidentFavorite,
    isVitalFavorite,
  };
};
