import React from 'react';
import './ShoppingItem.css';

/**
 * Отдельный компонент для отображения одного элемента списка покупок.
 * Принимает данные и колбэк через props:
 * - id: уникальный идентификатор товара
 * - name: название товара
 * - price: стоимость товара
 * - onDelete: функция удаления товара (передается от родительского компонента)
 */
function ShoppingItem({ id, name, price, onDelete }) {
  return (
    <li className="shopping-item">
      <div className="item-details">
        <span className="item-name">{name}</span>
        <span className="item-price">{Number(price).toLocaleString('ru-RU')} сом</span>
      </div>
      <button 
        className="delete-btn" 
        onClick={() => onDelete(id)}
        title="Удалить товар"
        aria-label={`Удалить ${name}`}
      >
        ✕
      </button>
    </li>
  );
}

export default ShoppingItem;

