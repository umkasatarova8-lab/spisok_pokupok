import React, { useState, useEffect } from 'react';
import ShoppingItem from './components/ShoppingItem';
import './App.css';

function App() {
  // 1. Использование STATE (состояния)
  // Состояние для хранения списка всех покупок
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('shopping_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка чтения из localStorage', e);
      }
    }
    // Начальные примеры товаров, если локальное хранилище пустое
    return [
      { id: 1, name: 'Хлеб бородинский', price: 45 },
      { id: 2, name: 'Молоко 3.2%', price: 90 },
      { id: 3, name: 'Яблоки (1 кг)', price: 130 }
    ];
  });

  // Состояние для управляемых полей ввода формы
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Сохранение списка товаров в localStorage при каждом изменении items
  useEffect(() => {
    localStorage.setItem('shopping_items', JSON.stringify(items));
  }, [items]);

  // Подсчет общей стоимости всех товаров в списке
  const totalPrice = items.reduce((sum, item) => sum + Number(item.price), 0);

  // Функция добавления нового товара
  const handleAddItem = (e) => {
    e.preventDefault();

    const trimmedName = nameInput.trim();
    const parsedPrice = parseFloat(priceInput);

    // Валидация введенных данных
    if (!trimmedName) {
      setErrorMessage('Пожалуйста, введите название товара.');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Пожалуйста, укажите корректную цену (больше 0).');
      return;
    }

    // Создаем новый объект товара
    const newItem = {
      id: Date.now(), // Уникальный идентификатор на основе текущего времени
      name: trimmedName,
      price: parsedPrice
    };

    // Обновляем состояние items (иммутабельно добавляем новый элемент)
    setItems((prevItems) => [...prevItems, newItem]);

    // Очищаем форму и ошибки
    setNameInput('');
    setPriceInput('');
    setErrorMessage('');
  };

  // Функция удаления товара по его id
  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Функция очистки всего списка
  const handleClearAll = () => {
    if (items.length > 0 && window.confirm('Вы уверены, что хотите очистить весь список покупок?')) {
      setItems([]);
    }
  };

  return (
    <div className="app-container">
      <div className="shopping-card">
        {/* Заголовок */}
        <header className="app-header">
          <h1>Список покупок</h1>
          <p className="subtitle">Удобный учет товаров и общей стоимости</p>
        </header>

        {/* Блок с общей стоимостью */}
        <div className="total-summary-card">
          <div className="summary-left">
            <span className="summary-label">Общая стоимость:</span>
            <span className="summary-amount">
              {totalPrice.toLocaleString('ru-RU')} сом
            </span>
          </div>
          <div className="summary-right">
            <span className="items-badge">
              Товаров: <strong>{items.length}</strong>
            </span>
            {items.length > 0 && (
              <button 
                type="button" 
                className="clear-all-btn" 
                onClick={handleClearAll}
                title="Очистить всё"
              >
                Очистить
              </button>
            )}
          </div>
        </div>

        {/* Форма добавления нового товара */}
        <form className="add-item-form" onSubmit={handleAddItem}>
          <div className="form-row">
            <div className="input-group name-group">
              <label htmlFor="itemName">Название товара</label>
              <input
                id="itemName"
                type="text"
                placeholder="Например, Сыр пармезан"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </div>

            <div className="input-group price-group">
              <label htmlFor="itemPrice">Цена (сом)</label>
              <input
                id="itemPrice"
                type="number"
                step="any"
                min="0"
                placeholder="150"
                value={priceInput}
                onChange={(e) => {
                  setPriceInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </div>
          </div>

          {/* Сообщение об ошибке */}
          {errorMessage && (
            <div className="error-banner">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="add-btn">
            + Добавить в список
          </button>
        </form>

        {/* Список товаров с передачей PROPS в отдельный компонент ShoppingItem */}
        <div className="list-section">
          <h2>Товары в списке</h2>

          {items.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">Список покупок пуст</p>
              <p className="empty-desc">Добавьте первый товар, используя форму выше</p>
            </div>
          ) : (
            <ul className="items-list">
              {items.map((item) => (
                // 2. Использование PROPS (передаем данные и функцию удаления в отдельный компонент)
                <ShoppingItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  onDelete={handleDeleteItem}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

