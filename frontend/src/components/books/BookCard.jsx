import React, { useState } from "react";
import "./BookCard.css";

const BookCard = ({ book, onDelete, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300'>` +
        `<rect width='100%' height='100%' fill='#cccccc'/>` +
        `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666666' font-family='Arial' font-size='14'>Image non disponible</text>` +
        `</svg>`
    );
  // Extraire les informations de l'auteur depuis authorInfo
  const getAuthorName = (authorInfo) => {
    if (authorInfo && authorInfo.firstName) {
      return `${authorInfo.firstName} ${authorInfo.lastName}`;
    }
    return "Auteur non chargé";
  };

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div
      className={`book-card ${isFlipped ? "is-flipped" : ""}`}
      onClick={() => setIsFlipped((v) => !v)}
    >
      <div className="book-card-inner">
        <div className="book-card-face book-card-front">
          <div className="book-image-container">
            <img
              src={book.image || PLACEHOLDER_IMG}
              alt={book.title}
              className="book-image"
              onError={handleImageError}
            />
          </div>
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">Par {getAuthorName(book.authorInfo)}</p>
            {book.description && (
              <p className="book-description">
                {book.description.length > 100
                  ? `${book.description.substring(0, 100)}...`
                  : book.description}
              </p>
            )}
            <div className="book-meta">
              <span className="book-pages">📄{book.pages} pages</span>
            </div>
          </div>
        </div>
        <div className="book-card-face book-card-back">
          <div className="book-back-content">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{getAuthorName(book.authorInfo)}</p>
            {book.description && (
              <p className="book-description">{book.description}</p>
            )}
            <div className="book-actions">
              <button
                className="btn btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}
              >
                ✏ Modifier
              </button>
              <button
                className="btn btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book.id);
                }}
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookCard;
