import React, { useState, useEffect } from "react";
import axios from 'axios';

const AdComponent = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getAds();
  }, []);

  const getAds = async () => {
    const response = await axios.get('/api/ads');
    setAds(response.data);
  };

  const createAd = async ad => {
    await axios.post('/api/ads', ad);
    getAds();
  };

  const updateAd = async ad => {
    await axios.put(`/api/ads/${ad.id}`, ad);
    getAds();
  };

  const deleteAd = async ad => {
    await axios.delete(`/api/ads/${ad.id}`);
    getAds();
  };

  const onSubmit = ad => {
    if (editing) {
      updateAd(ad);
      setEditing(false);
    } else {
      createAd(ad);
    }
    setSelectedAd(null);
  };

  return (
    <div>
      <h1>Annonces</h1>
      {ads.map(ad => (
        <div key={ad.id}>
          <h2>{ad.title}</h2>
          <p>{ad.description}</p>
          <button onClick={() => setSelectedAd(ad)}>Éditer</button>
          <button onClick={() => deleteAd(ad)}>Supprimer</button>
        </div>
      ))}
      <h2>{editing ? 'Modifier une annonce' : 'Créer une annonce'}</h2>
      <AdForm ad={selectedAd} onSubmit={onSubmit} />
    </div>
  );
};

const AdForm = ({ ad, onSubmit }) => {
  const [title, setTitle] = useState(ad ? ad.title : "");
  const [description, setDescription] = useState(ad ? ad.description : "");

  const submit = e => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={submit}>
      <label>
        Titre :
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        Description :
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </label>
      <button type="submit">Valider</button>
    </form>
  );
};

export default AdComponent;