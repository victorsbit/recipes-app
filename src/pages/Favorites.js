import React, { useState } from 'react';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function Favorites() {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShareBtn = (id) => {
    console.log(id);
    navigator.clipboard.writeText(`http://localhost:3000/foods/${id}`);
    setLinkCopied(true);
  };

  return (
    <div className="fav-all">
      <Header title="Favorite Recipes" />
      <button
        type="button"
        data-testid="filter-by-all-btn"
        id="All"
      >
        All
      </button>
      <button
        type="button"
        data-testid="filter-by-food-btn"
        id="Food"
      >
        Food
      </button>
      <button
        type="button"
        data-testid="filter-by-drink-btn"
        id="Drink"
      >
        Drinks
      </button>
      {favoriteRecipes.map((recipe, index) => (
        (recipe.type === 'food')
          ? (
            <div className="done-rec-cards" key={ index }>
              <a href={ `/foods/${recipe.id}` }>
                <img
                  className="done-rec-img"
                  src={ recipe.image }
                  alt={ recipe.name }
                  data-testid={ `${index}-horizontal-image` }
                />
              </a>
              <a href={ `/foods/${recipe.id}` }>
                <p data-testid={ `${index}-horizontal-name` }>{ recipe.name }</p>
              </a>
              <p data-testid={ `${index}-horizontal-top-text` }>
                { `${recipe.nationality} - ${recipe.category}` }
              </p>
              <button
                type="button"
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => handleShareBtn(recipe.id) }
                src={ shareIcon }
              >
                <img src={ shareIcon } alt="share-icon" />
              </button>
              {linkCopied && <span>Link copied!</span>}
              <button
                type="button"
                data-testid="0-horizontal-favorite-btn"
                src={ blackHeartIcon }
              >
                <img src={ blackHeartIcon } alt="#" />
              </button>
              <button
                type="button"
                data-testid="0-horizontal-favorite-btn"
                src={ blackHeartIcon }
              >
                <img src={ whiteHeartIcon } alt="#" />
              </button>
            </div>
          ) : (
            <div className="done-rec-cards" key={ index }>
              <a href={ `/drinks/${recipe.id}` }>
                <img
                  className="done-rec-img"
                  src={ recipe.image }
                  alt={ recipe.name }
                  data-testid={ `${index}-horizontal-image` }
                />
              </a>
              <a href={ `/drinks/${recipe.id}` }>
                <p data-testid={ `${index}-horizontal-name` }>{ recipe.name }</p>
              </a>
              <p data-testid={ `${index}-horizontal-top-text` }>
                { recipe.alcoholicOrNot }
              </p>
              <p>{ recipe.category }</p>
              <p data-testid={ `${index}-horizontal-done-date` }>{ recipe.doneDate }</p>
              <button
                type="button"
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => handleShareBtn(recipe.id) }
                src={ shareIcon }
              >
                <img src={ shareIcon } alt="share-icon" />
              </button>
              {linkCopied && <span>Link copied!</span>}
              <button
                type="button"
                data-testid="1-horizontal-favorite-btn"
                src={ blackHeartIcon }
              >
                <img src={ blackHeartIcon } alt="#" />
              </button>
              <button
                type="button"
                data-testid="1-horizontal-favorite-btn"
                src={ blackHeartIcon }
              >
                <img src={ whiteHeartIcon } alt="#" />
              </button>
            </div>
          )
      ))}
    </div>
  );
}

export default Favorites;

// RASCUNHO
/* <div>
        <button
          type="button"
          data-testid="filter-by-all-btn"
          id="All"
        >
          All
        </button>
        <button
          type="button"
          data-testid="filter-by-food-btn"
          id="Food"
        >
          Food
        </button>
        <button
          type="button"
          data-testid="filter-by-drink-btn"
          id="Drink"
        >
          Drinks
        </button>
      </div>
      <div>
        <img
          src=""
          alt=""
          data-testid="0-horizontal-image"
        />
        <p data-testid="0-horizontal-name">name</p>
        <p data-testid="0-horizontal-top-text">
          alguma coisa
        </p>

        <button
          type="button"
          data-testid="0-horizontal-share-btn"
          src=""
        >
          botão
        </button>
        <button
          type="button"
          data-testid="0-horizontal-favorite-btn"
          src=""
        >
          <img src={ shareIcon } alt="share-icon" />
          Favorite
        </button>
      </div>
      <div className="done-rec-cards">
        <img
          className="done-rec-img"
          src=""
          alt=""
          data-testid="1-horizontal-image"
        />
        <p data-testid="1-horizontal-name">nome</p>
        <p data-testid="1-horizontal-top-text">
          ALGUMA COISA
        </p>
        <button
          type="button"
          data-testid="1-horizontal-share-btn"
          src=""
        >
          allgo
        </button>
        <button
          type="button"
          data-testid="1-horizontal-favorite-btn"
          src=""
        >
          <img src="" alt="share-icon" />
          Favorite
        </button>
      </div> */
