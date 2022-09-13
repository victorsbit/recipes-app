import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import GlobalContext from '../context/GlobalContext';

export default function DrinkDetails() {
  const params = useParams();
  const history = useHistory();
  const id = Object.values(params)[0];
  const { verifyFavoriteRecipe, addRecipeToFavoriteList } = useContext(GlobalContext);
  const [recipe, setRecipe] = useState({});
  const [ingredientList, setIngredientList] = useState([]);
  const [measureList, setMeasureList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [inProgressObject, setInProgressObject] = useState({});
  const [linkCopied, setLinkCopied] = useState(false);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);
  const MAX_FOOD_ITEMS = 6;

  const addRecipeToInProgressList = () => {
    const inProgressRecipeList = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const newObj = {
      cocktails: { ...inProgressRecipeList.cocktails, [id]: [] },
      meals: { ...inProgressRecipeList.meals },
    };

    localStorage.setItem('inProgressRecipes', JSON.stringify(newObj));
    history.push(`/drinks/${id}/in-progress`);
  };

  useEffect(() => {
    const inProgressRecipesList = JSON
      .parse(localStorage.getItem('inProgressRecipes') || '{}');
    if (inProgressRecipesList.cocktails === undefined) {
      localStorage.setItem('inProgressRecipes', JSON
        .stringify({ cocktails: {}, meals: {} }));
    } else {
      setInProgressObject(inProgressRecipesList);
    }

    setIsRecipeFavorite((verifyFavoriteRecipe(id)));
  }, [verifyFavoriteRecipe, id]);

  useEffect(() => {
    const { cocktails } = inProgressObject;

    if (cocktails !== undefined) {
      if (cocktails[id] !== undefined) {
        setShowContinueBtn(true);
      }
    } else {
      setShowContinueBtn(false);
    }
  }, [inProgressObject, id]);

  useEffect(() => {
    const requestRecipe = async () => {
      const API_URL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      const result = await fetch(API_URL);
      const data = await result.json();

      setRecipe(data.drinks[0]);
    };

    const handleDoneRecipes = () => {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
      if (doneRecipes.length > 0) {
        if (doneRecipes[0].id === id) {
          setShowStartBtn(false);
        }
      } else {
        setShowStartBtn(true);
      }
    };

    handleDoneRecipes();
    requestRecipe();
  }, [params, id]);

  useEffect(() => {
    const ingredients = Object.entries(recipe);
    const newIngredientsList = [];
    const newMeasureList = [];

    ingredients.forEach((item) => {
      if (item[0].includes('strIngredient')
      && (typeof item[1]) === 'string' && item[1].length > 0) {
        newIngredientsList.push(item[1]);
      }
    });

    ingredients.forEach((item) => {
      if (item[0].includes('strMeasure')) {
        newMeasureList.push(item[1]);
      }
    });

    setMeasureList(newMeasureList);
    setIngredientList(newIngredientsList);
  }, [recipe]);

  useEffect(() => {
    const foodRequest = async () => {
      const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const result = await fetch(API_URL);
      const data = await result.json();

      setFoodList(data);
    };

    foodRequest();
  }, []);

  const handleLinkCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/drinks/${id}`);
    setLinkCopied(!linkCopied);
  };

  return (
    <main>
      <img src={ recipe.strDrinkThumb } data-testid="recipe-photo" alt="#" />
      <div>
        <h1 data-testid="recipe-title">{recipe.strDrink}</h1>
        <button
          type="button"
          data-testid="share-btn"
          onClick={ handleLinkCopy }
        >
          {linkCopied && <span>Link copied!</span>}
          <img src={ shareIcon } alt="#" />
        </button>
        {isRecipeFavorite && (
          <button
            type="button"
            data-testid="favorite-btn"
            src={ blackHeartIcon }
            onClick={ () => {
              setIsRecipeFavorite(!isRecipeFavorite);
              addRecipeToFavoriteList(recipe, 'drink');
            } }
          >
            <img src={ blackHeartIcon } alt="#" />
          </button>
        )}
        {!isRecipeFavorite && (
          <button
            type="button"
            data-testid="favorite-btn"
            src={ whiteHeartIcon }
            onClick={ () => {
              setIsRecipeFavorite(!isRecipeFavorite);
              addRecipeToFavoriteList(recipe, 'drink');
            } }
          >
            <img src={ whiteHeartIcon } alt="#" />
          </button>
        )}
        <br />
        <span data-testid="recipe-category">{`Category: ${recipe.strAlcoholic}`}</span>
      </div>
      <div>
        <h2>Ingredients</h2>
        <ul>
          {ingredientList.map((ingredient, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {`${ingredient} - ${measureList[index]}`}
            </li>
          ))}
        </ul>
        <div>
          <h2>Instructions</h2>
          <span data-testid="instructions">
            {recipe.strInstructions}
          </span>
        </div>
        <div className="recommendation-container">
          <h2>Recommended</h2>
          {foodList.length !== 0 && (
            <div className="recommendation-wrapper">
              {foodList.meals.slice(0, MAX_FOOD_ITEMS).map((meal, index) => (
                <div
                  key={ index }
                  className="recommendation"
                  data-testid={ `${index}-recomendation-card` }
                >
                  <img
                    src={ meal.strMealThumb }
                    alt="drink"
                    className="recommendation-img"
                  />
                  <span>{ meal.strCategory }</span>
                  <span data-testid={ `${index}-recomendation-title` }>
                    { meal.strMeal }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {(showStartBtn && !showContinueBtn) && (
            <button
              type="button"
              onClick={ addRecipeToInProgressList }
              data-testid="start-recipe-btn"
              className="bottom"
            >
              Start Recipe
            </button>
          )}
          {showContinueBtn && (
            <button
              type="button"
              data-testid="start-recipe-btn"
              className="bottom"
            >
              Continue Recipe
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
