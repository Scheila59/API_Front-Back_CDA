import React, { useState, useEffect, useCallback } from "react";
import { editorService } from "../services/api";
import "./AuthorsPage.css";
const EditorsPage = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEditors, setFilteredEditors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dateOfCreation: "",
    country: "",
  });
  const [editingId, setEditingId] = useState(null);
  // Charger les editeurs
  const loadEditors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await editorService.getAll();
      setEditors(data);
    } catch (e) {
      setError("Erreur lors du chargement des editeurs");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadEditors();
  }, [loadEditors]);
  // Filtrer les editeurs
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEditors(editors);
    } else {
      setFilteredEditors(
        editors.filter((a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [editors, searchTerm]);
  // Gérer le formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await editorService.update(editingId, form);
      } else {
        await editorService.create(form);
      }
      setForm({ name: "", dateOfCreation: "", address: "" });
      setEditingId(null);
      loadEditors();
    } catch (e) {
      setError("Erreur lors de la sauvegarde de l’editeur");
    }
  };
  const handleEdit = (editor) => {
    setForm({
      name: editor.name,
      dateOfCreation: editor.dateOfCreation,
      address: editor.address,
    });
    setEditingId(editor.id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet editeur ?")) return;
    try {
      await editorService.delete(id);
      loadEditors();
    } catch (e) {
      setError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="authors-page-container">
      <h2>􀀀 Liste des editeurs</h2>
      <input
        type="text"
        placeholder="Rechercher un editeur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="authors-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date de création</th>
              <th>adresse du siege social</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEditors.map((editor) => (
              <tr key={editor.id}>
                <td>{editor.name}</td>
                <td>{editor.dateOfCreation}</td>
                <td>{editor.address}</td>
                <td>
                  <button
                    onClick={() => handleEdit(editor)}
                    className="btnedit"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(editor.id)}
                    className="btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>{editingId ? "Modifier" : "Ajouter"} un editeur</h3>
      <form onSubmit={handleSubmit} className="author-form">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateOfCreation"
          placeholder="Date de création"
          value={form.dateOfCreation}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Addresse du siege social"
          value={form.address}
          onChange={handleChange}
        />
        <button type="submit" className="btn-save">
          {editingId ? "Enregistrer" : "Ajouter"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", dateOfCreation: "", address: "" });
              setEditingId(null);
            }}
            className="btncancel"
          >
            Annuler
          </button>
        )}
      </form>
    </div>
  );
};
export default EditorsPage;
